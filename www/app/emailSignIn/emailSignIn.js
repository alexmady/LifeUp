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

    .controller('EmailSignInCtrl', [ '$scope', '$rootScope', '$state', 'User', '$ionicHistory', '$ionicLoading', '$ionicModal', '$ionicPopup',
        function ($scope, $rootScope, $state, User, $ionicHistory, $ionicLoading, $ionicModal, $ionicPopup) {

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

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });

                User.resetPassword(user.email).then(
                    function () {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Success!',
                            template: 'Password reset email sent.'
                        });
                        alertPopup.then(function (res) {
                            $scope.closeModal();
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

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });

                User.login(user)
                    .then(function(data){
                        $ionicLoading.hide();
                        if (data) {
                            $state.go('dashboard.dashboardHome');
                        }
                    })
                    .catch(function(msg){
                        $ionicLoading.hide();

                        console.log(msg);

                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: msg
                        });
                        alertPopup.then(function (res) {
                            return;
                        });

                    });
            };

        }]);