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
        [ '$scope', '$rootScope', '$state', 'Auth', 'UserProfile', 'Util',
            function ($scope, $rootScope, $state, Auth, UserProfile, Util ) {

            $scope.go = function (goTo) {
                $state.go(goTo)
            };

            $scope.createAccount = function (user) {

                Util.showLoading();

                Auth.$createUser({
                    email: user.email,
                    password: user.pass
                }).then(function (userData) {

                        console.log("Successfully created user account with uid:", userData.uid);

                        Auth.$authWithPassword({
                            email: user.email,
                            password: user.pass
                        }).then(function (data) {
                            console.log('User logged in:');
                            UserProfile(data.uid).create(user.email);
                            Util.hideLoading();
                            $state.go('dashboard.dashboardHome');

                        }).catch(function (error) {
                            Util.hideLoading();
                            console.log(error);
                        });

                }).catch(function(error){
                    Util.hideLoading();
                    console.error(error);
                });

            };

        }]);