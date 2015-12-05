/**
 * Created by alexmady on 07/11/15.
 */
angular.module('User', [])

    .factory('User', [ 'FirebaseUtil', '$firebaseObject', 'FIREBASE_URL', '$q',
        function ( FirebaseUtil, $firebaseObject, FIREBASE_URL, $q) {

        var userData = {};
        var profile = null;

        var setAuthData = function(ad){
            userData.authData = ad;
        };

        var getProfile = function(){

            return $q(function(resolve, reject) {

                    if (profile) {
                        resolve(profile);
                    } else {

                        while (!userData.authData){

                            setTimeout(function(){
                                return getProfile();
                            }, 100);
                        };

                        var userRef = new Firebase(FIREBASE_URL + '/users').child(userData.authData.uid);
                        profile = $firebaseObject(userRef);
                        profile.$loaded(function () {
                            resolve(profile);
                        });
                    }
                });
        };

        var courseSteps = function(){

            var steps = [
                {name: 'DISARM', pos: 1, frame: 0, duration: 0, backButtonEnabled: false, length: 6},
                {name: 'SPACE', pos: 2, frame: 208, duration: 6, backButtonEnabled: true, length: 5 },
                {name: 'FLOW',  pos: 3,frame: 345, duration: 5, backButtonEnabled: true, length: 4},
                {name: 'ACT', pos: 4,frame: 520, duration: 6, backButtonEnabled: true, length: 3},
                {name: 'BE', pos: 5,frame: 592, duration: 5, backButtonEnabled: true, length: 2},
                {name: 'I', pos: 6,frame: 654, duration: 2, backButtonEnabled: true, length: 1}
            ];

            return steps;
        };

        var updateCourseProgress = function( module, slide, readyToClimb ){

            if (!userData.authData) {
                console.log('No user - can not update course progress');
                return;
            }

            profile.module = module;
            profile.slide = slide;

            if (arguments[2]){
                profile.readyToClimb =  readyToClimb;
            }

            if ( module >= profile.moduleFar){

                // if we have progressed to a higher module update module + slide
                // else if its the same module only update the slide if its later in the course
                if (module > profile.moduleFar){
                    profile.moduleFar = module;
                    profile.slideFar = slide;
                } else if (module === profile.moduleFar){
                    if (slide > profile.slideFar){
                        profile.slideFar = slide;
                    }
                }
            }
            profile.$save();
            // update users position in the course here
            console.log('Course module ' + module + ' slide ' + slide);
        };

        var logout = function(){
            console.log('logging out user');
            userData = {};
            profile = null;
        };

        return {
            updateCourseProgress: updateCourseProgress,
            setAuthData: setAuthData,
            getProfile: getProfile,
            userData: userData,
            logout: logout,
            courseSteps: courseSteps
        }

    }]);

