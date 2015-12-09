/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.account', [ 'User'])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.account', {
                url: "/account",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/account/account.html",
                        controller: 'AccountCtrl'
                    }
                }
            })
    }])

    .controller('AccountCtrl', [ '$scope', '$ionicModal', 'User', '$ionicLoading', '$ionicPopup',
        function($scope, $ionicModal, User, $ionicLoading, $ionicPopup) {

            $ionicModal.fromTemplateUrl('app/dashboard/components/account/changePassword.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;

            });

            $scope.showChangePasswordModal = function() {
                $scope.modal.show();
            };

            $scope.closeModal = function() {
                $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });

            $scope.logout = function(){
                User.logout();
            };

            $scope.changePassword = function(user){

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });

                try{
                    User.changePassword(user.oldPassword, user.newPassword).then(
                        function () {
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success!',
                                template: 'Password changed successfully.'
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
                                console.log(error);
                            });
                        });
                } catch (error){
                    console.log(error.stack);
                    $ionicLoading.hide();
                }
            };

    }]);