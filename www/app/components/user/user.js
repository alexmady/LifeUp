/**
 * Created by alexmady on 07/11/15.
 */
angular.module('User', [])

    .factory('User', [ 'FirebaseUtil', '$firebaseObject', 'FIREBASE_URL', '$q', '$ionicLoading', '$firebaseAuth', '$state', '$ionicPopup',
        function (FirebaseUtil, $firebaseObject, FIREBASE_URL, $q, $ionicLoading, $firebaseAuth, $state, $ionicPopup) {

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

                try {
                    fauth.$authWithPassword({
                        email: user.email,
                        password: user.pass
                    }).then(function (data) {
                        //console.log('User logged in:');
                        //console.log(data);

                        // when the user logs in set up the angular fire binding to keep the
                        // user automatically updated

                    }).catch(function (error) {
                        // An alert dialog

                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: "Sorry we didn't recognise that email address / password."
                        });
                        alertPopup.then(function (res) {
                            return;
                        });
                        console.log(error);
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
                        return;
                    });
                }
            };

            var facebookLogin = function () {

                //console.log('facebook login');

                var options = {
                    remember: "default",
                    scope: "email"
                };

                fauth.$authWithOAuthRedirect("facebook", options).then(function (authData) {

                }).catch(function (error) {
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

                var email = userData.authData.password.email;

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


            var getProfile = function () {

                return $q(function (resolve, reject) {

                    //console.log('profile?');
                    //console.log(profile);
                    if (profile) {
                        resolve(profile);
                    } else {

                        var userId = userData.authData.uid;
                        if (!userId) {
                            userId = Auth.getAuth();
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
                console.log('logging out user');
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
                changePassword: changePassword
            }

        }]);

