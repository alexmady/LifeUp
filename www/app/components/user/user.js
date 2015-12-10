/**
 * Created by alexmady on 07/11/15.
 */
angular.module('lifeUp.user', ['firebase'])

    .factory('UserProfile', ['$firebase', '$firebaseObject', 'FIREBASE_URL', 'courseMetaData',
        function( $firebase, $firebaseObject, FIREBASE_URL, courseMetaData ){

        // create a new service based on $firebaseObject
        var UserProfile = $firebaseObject.$extend({
            // these methods exist on the prototype, so we can access the data using `this`
            getProfile: function() {
                return this;
            },

            create: function(email){

                var dt = new Date();

                this.created = dt.getTime();
                this.module = 0;
                this.slide =  0;
                this.moduleFar = 0;
                this.slideFar = 0;
                this.showPlayButton =  true;
                this.readyToClimb = false;
                this.firstLogin =  true;
                this.courseCompleted =  false;
                this.completeCongratulate =  false;
                this.resilienceComplete =  false;
                this.authenticityComplete =  false;
                this.connectionComplete = false;
                this.email = email;

                this.$save().then(function(){
                    console.log('Profile saved successfully');
                });
            },

            updateCourseProgress: function (module, slide, readyToClimb) {

                this.module = module;
                this.slide = slide;

                if (arguments[2]) {
                    this.readyToClimb = readyToClimb;
                }

                if (module >= this.moduleFar) {

                    // if we have progressed to a higher module update module + slide
                    // else if its the same module only update the slide if its later in the course
                    if (module > this.moduleFar) {
                        this.moduleFar = module;
                        this.slideFar = slide;
                    } else if (module === this.moduleFar) {
                        if (slide > this.slideFar) {
                            this.slideFar = slide;
                        }
                    }
                }

                if (module === courseMetaData.length && slide === 1) {
                    this.courseCompleted = true;
                }

                this.$save();
                // update users position in the course here
                //console.log('Course module ' + module + ' slide ' + slide);
            }
        });

        return function(uid) {

            var ref = new Firebase(FIREBASE_URL+'/users');
            var profileRef = ref.child(uid);

            // return it as a synchronized object
            return new UserProfile(profileRef);
        }

    }])


    .factory('User', [ '$firebase', '$firebaseObject', 'FIREBASE_URL', '$q',  '$firebaseAuth', '$state', 'Auth',
        function ( $firebase, $firebaseObject, FIREBASE_URL, $q, $firebaseAuth, $state, Auth) {



            var facebookLogin = function () {

                return $q(function(resolve,reject){

                    var options = {
                        remember: "default",
                        scope: "email"
                    };

                    Auth.$authWithOAuthRedirect("facebook", options).then(function (authData) {
                        resolve(authData);
                    }).catch(function (error) {

                        if (error.code === "TRANSPORT_UNAVAILABLE") {
                            fauth.$authWithOAuthPopup("facebook", options).then(function (authData) {
                                // User successfully logged in. We can log to the console
                                // since we’re using a popup here
                                resolve(authData);
                            });
                        } else {
                            // Another error occurred
                            reject(error);
                        }
                    });

                });
            };


            var resetPassword = function (email) {

                if (!email) {
                    throw new Error('Please supply email address to reset password.');
                }

                return $q(function (resolve, reject) {

                    Auth.$resetPassword({
                        email: email
                    }, function (error) {
                        if (error) {
                            switch (error.code) {
                                case "INVALID_USER":
                                    reject("The specified user account does not exist.");
                                    break;
                                default:
                                    reject("Error resetting password:", error);
                            }
                        } else {
                            resolve("Password reset email sent successfully!");
                        }
                    });

                });
            };



            var checkAndCreateUserProfile = function( authData, user ){

                var checkRef = getRef().child(authData.uid);
                checkRef.once("value",function(snapshot){

                    var exists = snapshot.exists();

                    if (!exists){
                        createProfile( authData, user );
                    }
                });
            };





            return {

                facebookLogin: facebookLogin,
                resetPassword: resetPassword,
                checkAndCreateUserProfile: checkAndCreateUserProfile
            }

        }]);

