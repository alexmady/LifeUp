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

            console.log('connectivity monitor online - will update profile');


            this.profile.module = module;
            this.profile.slide = slide;

            if ( module >= this.profile.moduleFar){
                this.profile.moduleFar = module;
                if (slide > this.profile.slideFar){
                    this.profile.slideFar = slide;
                }
            }

            this.profile.$save();

/*            this.currentModule = module;
            this.currentSlide = slide;
            var me =this;

            if (ConnectivityMonitor.isOnline()){

                FirebaseUtil.updateProfile(this.authData, module, slide)
                    .then(function(){

                        console.log('Firebase profile was updated');
                        me.profileUpdated = true;

                    }).catch(function(error){

                        console.log('There was a problem update the firebase profile:');
                        console.log(error);

                    });
            }*/

            // update users position in the course here
            console.log('Course module ' + module + ' slide ' + slide);
        };
    }]);

