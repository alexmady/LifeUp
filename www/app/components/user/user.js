/**
 * Created by alexmady on 07/11/15.
 */
angular.module('User', ['firebase'])

    .factory('User', [ '$firebase', '$firebaseObject', 'FIREBASE_URL', '$q', '$ionicLoading', '$firebaseAuth', '$state', '$ionicPopup',
        function ( $firebase, $firebaseObject, FIREBASE_URL, $q, $ionicLoading, $firebaseAuth, $state, $ionicPopup) {

            var userData = {};
            var profile = null;

            var ref = new Firebase(FIREBASE_URL + '/users');
            var fauth = $firebaseAuth(ref);

            ref.onAuth(function(authData){

                $ionicLoading.hide();

                if (authData){
                    userData.authData = authData;

                    if (authData.provider === "facebook"){
                        var user = { email: authData.facebook.email };
                        FirebaseUtil.checkAndCreateUserProfile(authData, user);
                    }
                    $state.go('dashboard.dashboardHome');
                } else {
                    $state.go('home');
                }
            });

            var login = function (user) {

                return $q(function(resolve, reject){

                    try {

                        fauth.$authWithPassword({
                            email: user.email,
                            password: user.pass
                        }).then(function (data) {
                            console.log('User logged in:');
                            //console.log(data);
                            resolve(data);
                        }).catch(function (error) {
                            // An alert dialog

                            var errMsg = "Sorry we didn't recognise that email address / password.";

                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Login failed!',
                                template: errMsg
                            });
                            alertPopup.then(function (res) {
                                reject(errMsg);
                            });
                        });
                    } catch (error) {

                        var msg = 'Unknown Error, please try again.';

                        if (!user || !user.email || !user.pass) {
                            msg = 'Either email address or password was not specified. Please try again. ';
                        }

                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: msg
                        });
                        alertPopup.then(function (res) {
                            reject(msg);
                        });
                    }
                });


            };

            var facebookLogin = function () {

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });

                var options = {
                    remember: "default",
                    scope: "email"
                };

                fauth.$authWithOAuthRedirect("facebook", options).then(function (authData) {

                    }).catch(function (error) {

                    $ionicLoading.hide();

                    if (error.code === "TRANSPORT_UNAVAILABLE") {
                        fauth.$authWithOAuthPopup("facebook", options).then(function (authData) {
                            // User successfully logged in. We can log to the console
                            // since we’re using a popup here
                            console.log(authData);
                        });
                    } else {
                        // Another error occurred
                        console.log(error);
                    }
                });
            };


            var resetPassword = function (email) {

                if (!email) {
                    throw new Error('Please supply email address to reset password.');
                }

                return $q(function (resolve, reject) {

                    ref.resetPassword({
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

            var changePassword = function (oldPassword, newPassword) {

                var email ="";
                if (userData.authData.password){
                    email = userData.authData.password.email;
                } else {
                    email = userData.authData.facebook.email;
                }

                console.log('User email: ' + email);

                return $q(function (resolve, reject) {
                    ref.changePassword({
                        email: email,
                        oldPassword: oldPassword,
                        newPassword: newPassword
                    }, function (error) {
                        if (error) {
                            switch (error.code) {
                                case "INVALID_PASSWORD":
                                    reject("The specified user account password is incorrect.");
                                    break;
                                case "INVALID_USER":
                                    reject("The specified user account does not exist.");
                                    break;
                                default:
                                    reject("Error changing password:", error);
                            }
                        } else {
                            logout();
                            resolve("User password changed successfully!");
                        }
                    });
                });
            };

            var createProfile = function(authData, user){

                var uid = authData.uid;
                var dt = new Date();

                var value = {};
                value[uid] = {
                    created: dt.getTime(),
                    module:0,
                    slide: 0,
                    moduleFar: 0,
                    slideFar: 0,
                    showPlayButton: true,
                    readyToClimb:false,
                    firstLogin: true,
                    courseCompleted: false,
                    completeCongratulate: false,
                    resilienceComplete: false,
                    authenticityComplete: false,
                    connectionComplete: false,
                    email: user.email };

                var callback = function(error){
                    if (error){
                        console.log(error);
                    } else {
                        //console.log('Synchronization succeeded');
                    }
                };

                return ref.update(value, callback);
            };


            var checkAndCreateUserProfile = function( authData, user ){

                var checkRef = ref.child(authData.uid);
                checkRef.once("value",function(snapshot){

                    var exists = snapshot.exists();

                    if (!exists){
                        createProfile( authData, user );
                    }
                });
            };


            var getProfile = function () {

                return $q(function (resolve, reject) {

                    //console.log('profile?');
                    //console.log(profile);
                    if (profile) {
                        resolve(profile);
                    } else {

                        var userId = userData.authData.uid;
                        if (!userId) {
                            throw new Error('NO USER DATA');
                        }

                        var userRef = new Firebase(FIREBASE_URL + '/users').child(userId);
                        profile = $firebaseObject(userRef);
                        profile.$loaded(function (pro) {
                            //console.log('PROFILE LOADED');
                            resolve(pro);
                        });
                    }
                });
            };

            var courseSteps = function () {

                var steps = [
                    {name: 'DISARM', pos: 1, frame: 0, duration: 0, backButtonEnabled: false, length: 6},
                    {name: 'SPACE', pos: 2, frame: 208, duration: 6, backButtonEnabled: true, length: 5 },
                    {name: 'FLOW', pos: 3, frame: 345, duration: 5, backButtonEnabled: true, length: 4},
                    {name: 'ACT', pos: 4, frame: 520, duration: 6, backButtonEnabled: true, length: 3},
                    {name: 'BE', pos: 5, frame: 592, duration: 5, backButtonEnabled: true, length: 2},
                    {name: 'I', pos: 6, frame: 654, duration: 2, backButtonEnabled: true, length: 1}
                ];

                return steps;
            };


            var createAccount = function(user){

                try{

                    ref.createUser({
                        email: user.email,
                        password: user.pass
                    }, function (error, userData) {

                        $ionicLoading.hide();
                        if (error) {

                            console.log(error);
                            var alertPopup = $ionicPopup.alert({
                                title: 'Sorry!',
                                template: error
                            });
                            alertPopup.then(function () {
                                return;
                            });

                        } else {
                            console.log("Successfully created user account with uid:", userData.uid);
                            console.log('about to create user profile...');

                            login(user).then(function(authData){
                                createProfile(authData, user);
                            });


                        }
                    });

                } catch (error) {

                    console.log(error.stack);

                    $ionicLoading.hide();

                    var res = error.message.replace("Firebase.createUser", "");

                    var alertPopup = $ionicPopup.alert({
                        title: 'Sorry!',
                        template: res
                    });

                    alertPopup.then(function () {
                        return;
                    });
                }
            };

            var updateCourseProgress = function (module, slide, readyToClimb) {

                if (!userData.authData) {
                    console.log('No user - can not update course progress');
                    return;
                }

                profile.module = module;
                profile.slide = slide;

                if (arguments[2]) {
                    profile.readyToClimb = readyToClimb;
                }

                if (module >= profile.moduleFar) {

                    // if we have progressed to a higher module update module + slide
                    // else if its the same module only update the slide if its later in the course
                    if (module > profile.moduleFar) {
                        profile.moduleFar = module;
                        profile.slideFar = slide;
                    } else if (module === profile.moduleFar) {
                        if (slide > profile.slideFar) {
                            profile.slideFar = slide;
                        }
                    }
                }

                if (module === courseSteps().length && slide === 1) {
                    profile.courseCompleted = true;
                }

                profile.$save();
                // update users position in the course here
                //console.log('Course module ' + module + ' slide ' + slide);
            };

            var logout = function () {
                fauth.$unauth();
                userData = {};
                profile = null;
            };

            return {
                updateCourseProgress: updateCourseProgress,
                getProfile: getProfile,
                userData: userData,
                logout: logout,
                courseSteps: courseSteps,
                login: login,
                facebookLogin: facebookLogin,
                resetPassword: resetPassword,
                changePassword: changePassword,
                createProfile: createProfile,
                checkAndCreateUserProfile: checkAndCreateUserProfile,
                createAccount: createAccount
            }

        }]);

