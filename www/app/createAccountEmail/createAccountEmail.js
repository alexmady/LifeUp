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
        [ '$scope', '$rootScope', '$state', 'Auth', 'UserProfile', 'Util', '$stateParams', 'CourseCodes',
            function ($scope, $rootScope, $state, Auth, UserProfile, Util, $stateParams, CourseCodes ) {

            $scope.go = function (goTo) {
                $state.go(goTo)
            };

            $scope.createAccount = function (user) {

                // ask for a promo code and check that it has not been used already

                try {
                    if (!Util.isOnline()){
                        Util.popup('No Internet Connection', 'No internet connection. Please try again when you have an internet connection.', null, $scope);
                        return;
                    }
                } catch( error ){ }


                try {

                    Util.showLoading();


                    /*if (!user || !user.firstname){
                        Util.hideLoading();
                        Util.popup('Invalid', 'Please enter your first name.', null, $scope);
                        return;
                    }

                    if (!user.surname){
                        Util.hideLoading();
                        Util.popup('Invalid', 'Please enter your surname.', null, $scope);
                        return;
                    }*/

                    if (!user.courseCode){
                        Util.hideLoading();
                        Util.popup('Invalid', 'Please enter your LifeUp course code.', null, $scope);
                        return;
                    }

                    CourseCodes.$loaded()
                        .then(function(){

                            var pc = CourseCodes[user.courseCode];
                            if (pc && !pc.used){

                                return Auth.$createUser({
                                    email: user.email,
                                    password: user.pass
                                }).then(function (userData) {

                                    Auth.$authWithPassword({
                                        email: user.email,
                                        password: user.pass
                                    }).then(function (data) {

                                        pc.used = true;
                                        CourseCodes.$save();
                                        user.tag = pc.tag;

                                        UserProfile(data.uid).create(user, $stateParams.answers);

                                        Util.hideLoading();
                                        $state.go('dashboard.dashboardHome');
                                        return;
                                    });
                                });
                            }
                            Util.hideLoading();
                            if (pc && pc.used){
                                Util.popup('Invalid Course Code!', 'The course code you specified has already been used.', null, $scope);
                            } else {
                                Util.popup('Invalid Course Code!', 'The course code you entered does not exist. Please check your code and try again.', null, $scope);
                            }
                        }).catch(function(error){
                            Util.hideLoading();
                            console.log(error);
                            var err = error;

                            if (error.message.toLowerCase().indexOf('email') > 0){
                                err = 'Please check you have entered a valid email address.';
                            } else if ( error.message.toLowerCase().indexOf('password') > 0){
                                err = 'Please check you have entered a password.';
                            }
                            if ( error.message.toLowerCase().indexOf('already') > 0){
                                err = 'The specified email address is already in use.';
                            }
                            Util.popup('Error!', err, null, $scope);
                       });
                } catch (error){
                    Util.hideLoading();
                    console.log(error)
                    Util.popup('Error!', 'Please make sure you have entered a valid email address and password and try again!', null, $scope);
                }
            };
        }]);