/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.createAccount', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('createAccountChoice', {
                url: '/createAccountChoice',
                templateUrl: 'app/createAccountChoice/createAccountChoice.html',
                controller: 'CreateAccountChoiceCtrl',
                resolve: {
                    "currentAuth": ["Auth", function (Auth) {
                        return Auth.$waitForAuth();
                    }]
                }
            })
    }])

    .controller('CreateAccountChoiceCtrl', [ '$scope', '$state', '$ionicPopup', 'Auth', 'UserProfile', 'Util', '$cordovaFacebook',
        function($scope, $state, $ionicPopup, Auth, UserProfile, Util, $cordovaFacebook) {

        $scope.go = function(goTo){
            $state.go(goTo)
        };

        $scope.facebookSignup = function(){

            Util.showLoading();

            var options = {
                remember: "default",
                scope: "email"
            };
            console.log('starting facebook login');

            if(ionic.Platform.isWebView()){

                $cordovaFacebook.login(["public_profile", "email"]).then(function(success){

                    console.log(success);

                    Auth.$authWithOAuthToken("facebook", success.authResponse.accessToken). then( function( authData) {

                       console.log('Authenticated successfully with payload:', authData);

                        try {

                            UserProfile(authData.uid).$loaded()
                                .then(function(profile){
                                    if (!profile.exists()){
                                        console.log('facebook profile was not already created... creating...');
                                        profile.create(authData.facebook.email);
                                    }
                                    console.log('going home');
                                    $state.go('dashboard.dashboardHome');
                                    Util.hideLoading();
                                });


                        } catch (error){
                            Util.hideLoading();
                            console.log(error.message);
                            console.error(error);
                        }

                    }).catch(function(error){
                        Util.hideLoading();

                        console.log('Firebase login failed!', error);
                    });

                }, function(error){
                    Util.hideLoading();
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
                                    console.log('facebook profile was not already created... creating...');
                                    profile.create(authData.facebook.email);
                                }
                                console.log('going home');
                                $state.go('dashboard.dashboardHome');
                                Util.hideLoading();
                            });

                    } catch (error){
                        Util.hideLoading();
                        console.log(error.message);
                        console.error(error);
                    }
                });
            }
        };
    }]);