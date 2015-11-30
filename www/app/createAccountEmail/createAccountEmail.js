/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.createAccountEmail', [])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('createAccountEmail', {
                url: '/createAccountEmail',
                templateUrl: 'app/createAccountEmail/createAccountEmail.html',
                controller: 'CreateAccountEmailCtrl'
            })
    }])

    .controller('CreateAccountEmailCtrl',
    [ '$scope', '$rootScope', '$state', 'FIREBASE_URL', 'FirebaseUtil', '$ionicPopup', 'Auth', '$ionicLoading',
        function ($scope, $rootScope, $state, FIREBASE_URL, FirebaseUtil, $ionicPopup, Auth, $ionicLoading) {

            $scope.go = function (goTo) {
                $state.go(goTo)
            };

            $scope.createAccount = function (user) {

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });

                var ref = new Firebase(FIREBASE_URL);

                try{

                    ref.createUser({
                        email: user.email,
                        password: user.pass
                    }, function (error, userData) {

                        if (error) {
                            $ionicLoading.hide();

                            var alertPopup = $ionicPopup.alert({
                                title: 'Sorry!',
                                template: error
                            });

                            alertPopup.then(function () {
                                return;
                            });

                        } else {
                            console.log("Successfully created user account with uid:", userData.uid);

                            FirebaseUtil.createProfile(userData, user);

                            Auth.login(user);

                        }
                    });

                } catch(error){

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
        }]);