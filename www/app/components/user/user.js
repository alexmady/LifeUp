/**
 * Created by alexmady on 07/11/15.
 */
angular.module('User', [])

    .service('User', [ 'FirebaseUtil', '$firebaseObject', 'FIREBASE_URL',
        function ( FirebaseUtil, $firebaseObject, FIREBASE_URL) {

        this.authData = null;

        this.setAuthData = function(authData){
            this.authData = authData;
            var userRef = new Firebase(FIREBASE_URL + '/users').child(authData.uid);
            this.profile = $firebaseObject(userRef);
        };

        this.updateCourseProgress = function( module, slide ){

            if (!this.authData) {
                console.log('No user - can not update course progress');
                return;
            }

            this.profile.module = module;
            this.profile.slide = slide;


            if ( module >= this.profile.moduleFar){

                // if we have progressed to a higher module update module + slide
                // else if its the same module only update the slide if its later in the course
                if (module > this.profile.moduleFar){
                    this.profile.moduleFar = module;
                    this.profile.slideFar = slide;
                } else if (module === this.profile.moduleFar){
                    if (slide > this.profile.slideFar){
                        this.profile.slideFar = slide;
                    }
                }
            }

            this.profile.$save();

            // update users position in the course here
            console.log('Course module ' + module + ' slide ' + slide);
        };
    }]);

