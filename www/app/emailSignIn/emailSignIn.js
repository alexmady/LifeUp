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

                Util.showLoading();

                Auth.$authWithPassword({
                    email: user.email,
                    password: user.pass
                }).then(function(authData) {

                    Util.hideLoading();
                    console.log("Logged in as:", authData.uid);
                    $state.go('dashboard.dashboardHome');

                }).catch(function(error) {
                    Util.hideLoading();
                    console.error("Authentication failed:", error);

                    $ionicPopup.alert({
                        title: 'Error',
                        template: error
                    }).then(function (res) { return; });

                });

             };

        }]);