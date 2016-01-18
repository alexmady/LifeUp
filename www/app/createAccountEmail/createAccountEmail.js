(function () {
    'use strict';


    angular.module('lifeUp.createAccountEmail', [])

        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider
                .state('createAccountEmail', {
                    cache: false,
                    url: '/createAccountEmail',
                    templateUrl: 'createAccountEmail.html',
                    controller: 'CreateAccountEmailCtrl',
                    params: {
                        answers: null
                    }
                });
        }])

        .controller('CreateAccountEmailCtrl',
        [ '$scope', '$rootScope', '$state', 'Auth', 'UserProfile', 'Util', '$stateParams',
            function ($scope, $rootScope, $state, Auth, userProfile, Util, $stateParams ) {

                $scope.go = function (goTo) {
                    $state.go(goTo);
                };

                $scope.createAccount = function (user) {

                console.log('creating account....');
                    try {
                        if (!Util.isOnline()){
                            Util.popup('No Internet Connection', 'No internet connection. Please try again when you have an internet connection.', null, $scope);
                            return;
                        }
                    } catch( error ){ }


                    try {

                        Util.showLoading();


                        return Auth.$createUser({
                            email: user.email,
                            password: user.pass
                        }).then(function (userData) {

                            return Auth.$authWithPassword({
                                email: user.email,
                                password: user.pass
                            }).then(function (data) {

                                userProfile(data.uid).create(user, $stateParams.answers);

                                Util.hideLoading();
                                $state.go('dashboard.dashboardHome');
                                return;
                            });

                        }).catch(function (error) {

                            console.log(error);
                            Util.hideLoading();

                            var err = error;

                            if (error.message.toLowerCase().indexOf('email') > 0) {
                                err = 'Please check you have entered a valid email address.';
                            } else if (error.message.toLowerCase().indexOf('password') > 0) {
                                err = 'Please check you have entered a password.';
                            }
                            if (error.message.toLowerCase().indexOf('already') > 0) {
                                err = 'The specified email address is already in use.';
                            }
                            Util.popup('Error!', err, null, $scope);
                        });

                    } catch (error) {
                        Util.hideLoading();
                        console.log(error);



                        Util.popup('Error!', 'Please make sure you have entered a valid email address and password and try again!', null, $scope);
                    }
                };
            }]);

}());
