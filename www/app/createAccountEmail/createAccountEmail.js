/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.createAccountEmail', [])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('createAccountEmail', {
                cache: false,
                url: '/createAccountEmail',
                templateUrl: 'app/createAccountEmail/createAccountEmail.html',
                controller: 'CreateAccountEmailCtrl',
                params: {
                    answers: null
                }
            })
    }])

    .controller('CreateAccountEmailCtrl',
        [ '$scope', '$rootScope', '$state', 'Auth', 'UserProfile', 'Util', '$stateParams',
            function ($scope, $rootScope, $state, Auth, UserProfile, Util, $stateParams ) {

            $scope.go = function (goTo) {
                $state.go(goTo)
            };

            $scope.createAccount = function (user) {

                if (!Util.isOnline()){
                    Util.popup('No Internet Connection', 'Please try again when you have a connection.', null, $scope);
                    return;
                }

                Util.showLoading();

                try {
                    Auth.$createUser({
                        email: user.email,
                        password: user.pass
                    }).then(function (userData) {

                        Auth.$authWithPassword({
                            email: user.email,
                            password: user.pass
                        }).then(function (data) {
                            console.log('User logged in:');
                            console.log($stateParams.answers);
                            UserProfile(data.uid).create(user.email, $stateParams.answers);
                            Util.hideLoading();
                            $state.go('dashboard.dashboardHome');

                        }).catch(function (error) {
                            Util.hideLoading();
                            Util.popup('Error!', 'Please make sure you entered a valid email and password and try again!', null, $scope);
                            console.log(error);
                        });

                    }).catch(function(error){
                        Util.hideLoading();
                        console.error(error);
                        Util.popup('Error!', 'Please make sure you have entered a valid email address and password and try again!', null, $scope);
                    });

                } catch (error){
                    Util.hideLoading();
                    console.log(error)
                    Util.popup('Error!', 'Please make sure you have entered a valid email address and password and try again!', null, $scope);
                }
            };
        }]);