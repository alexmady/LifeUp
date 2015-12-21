/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.emailSignIn', [])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('emailSignIn', {
                url: '/emailSignIn',
                templateUrl: 'app/emailSignIn/emailSignIn.html',
                controller: 'EmailSignInCtrl'
            })
    }])

    .controller('EmailSignInCtrl',
        [   '$scope',
            '$rootScope',
            '$state',
            '$ionicHistory',
            '$ionicModal',
            '$ionicPopup',
            'Util',
            'Auth',
        function ( $scope,
                   $rootScope,
                   $state,
                   $ionicHistory,
                   $ionicModal,
                   $ionicPopup,
                   Util,
                   Auth  ) {

            $scope.go = function (goTo) {
                $state.go(goTo)
            };

            $ionicModal.fromTemplateUrl('app/emailSignIn/forgotPassword.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.closeModal = function () {
                $scope.modal.hide();
            };

            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            $scope.showResetPasswordModal = function () {
                $scope.modal.show();
            };

            $scope.resetPassword = function (user) {

                if (!Util.isOnline()){
                    Util.popup('No Internet Connection', 'Please try again when you have a connection.', null, $scope);
                    return;
                }

                Util.showLoading();

                Auth.$resetPassword(user.email).then(
                    function () {
                        Util.hideLoading();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success!',
                            template: 'Password reset email sent.'
                        });
                        alertPopup.then(function (res) {
                            $scope.closeModal();
                            Auth.$unauth();
                            $state.go('emailSignIn');
                        });
                    }
                ).catch(function (error) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: error
                        });
                        alertPopup.then(function (res) {
                            return;
                        });

                    });
            };

            $scope.goBack = function () {
                $ionicHistory.goBack();
            };

            $scope.login = function (user) {

                if (!Util.isOnline()){
                    Util.popup('No Internet Connection', 'You need to be connected to the internet to sign in. Please try again when you have a connection.', null, $scope);
                    return;
                }

                Util.showLoading();

                try{
                    Auth.$authWithPassword({
                        email: user.email,
                        password: user.pass
                    }).then(function(authData) {
                        Util.hideLoading();
                        $state.go('dashboard.dashboardHome');
                    }).catch(function(error) {
                        Util.hideLoading();

                    });
                } catch (error){

                    Util.hideLoading();
                    Util.popup("ERROR", "Oh dear! Something went wrong... <br> Please check you specified your email and password correctly!", null, $scope);
                }

             };

        }]);