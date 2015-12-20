/**
 * Created by alexmady on 10/12/15.
 */

angular.module('lifeUp.util', ['ionic'])

    .factory('Util', ['$ionicLoading', '$cordovaFacebook', 'Auth', 'UserProfile', '$state',

        function($ionicLoading, $cordovaFacebook, Auth, UserProfile, $state) {

            var showLoading = function(){
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });
            };

            var hideLoading = function() {
                $ionicLoading.hide();
            };


            var facebookLogin = function(goalsQuestionsAnswers) {

                showLoading();

                var options = {
                    remember: "default",
                    scope: "email"
                };

                if(ionic.Platform.isWebView()){

                    $cordovaFacebook.login(["public_profile", "email"]).then(function(success){

                        Auth.$authWithOAuthToken("facebook", success.authResponse.accessToken). then( function( authData) {

                            try {

                                UserProfile(authData.uid).$loaded()
                                    .then(function(profile){
                                        if (!profile.exists()){
                                            profile.create(authData.facebook.email, goalsQuestionsAnswers);
                                        }
                                        $state.go('dashboard.dashboardHome');
                                        hideLoading();
                                    });


                            } catch (error){
                                hideLoading();
                                console.log(error.message);
                                console.error(error);
                            }

                        }).catch(function(error){
                            hideLoading();
                            console.log('Firebase login failed!', error);
                        });

                    }, function(error){
                        hideLoading();
                        console.log(error);
                    });

                }
                else {

                    Auth.$authWithOAuthPopup("facebook", options).then(function (authData) {
                        // User successfully logged in. We can log to the console
                        // since we’re using a popup here
                        try {

                            UserProfile(authData.uid).$loaded()
                                .then(function(profile){
                                    if (!profile.exists()){
                                        profile.create(authData.facebook.email, goalsQuestionsAnswers);
                                    }
                                    $state.go('dashboard.dashboardHome');
                                    hideLoading();
                                }).catch(function(error){
                                    console.log(error);
                                    hideLoading();
                                });

                        } catch (error){
                            hideLoading();
                            console.log(error.message);
                            console.error(error);
                        }
                    });
                }

            };

            return {
                showLoading: showLoading,
                hideLoading: hideLoading,
                facebookLogin: facebookLogin
            }
        }
    ]);