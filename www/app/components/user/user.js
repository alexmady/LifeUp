/**
 * Created by alexmady on 07/11/15.
 */
angular.module('User', [])

    .factory('User', [ 'FirebaseUtil', '$firebaseObject', 'FIREBASE_URL',
        function ( FirebaseUtil, $firebaseObject, FIREBASE_URL) {

        var userData = {};
        var profile = null;

        var setAuthData = function(ad){
            userData.authData = ad;
            var userRef = new Firebase(FIREBASE_URL + '/users').child(userData.authData.uid);
            profile = $firebaseObject(userRef);
        };

        var getProfile = function(){
            return profile;
        };

        var getAuthData = function(){
            return userData.authData;
        };

        var updateCourseProgress = function( module, slide, readyToClimb){

            if (!userData.authData) {
                console.log('No user - can not update course progress');
                return;
            }

            profile.module = module;
            profile.slide = slide;
            profile.readyToClimb =  readyToClimb;

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

        return {
            updateCourseProgress: updateCourseProgress,
            setAuthData: setAuthData,
            getProfile: getProfile,
            userData: userData
        }

    }]);

