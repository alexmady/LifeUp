/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.account', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.account', {
                url: "/account",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/account/account.html",
                        controller: 'AccountCtrl'
                    }
                },
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth", function (Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }]
                }
            })
    }])

    .controller('AccountCtrl', [ '$scope', '$ionicModal', 'User', '$ionicLoading', '$ionicPopup', 'Auth', '$state',
        function($scope, $ionicModal, User, $ionicLoading, $ionicPopup, Auth, $state) {

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

                Auth.$unauth();
                $state.go('home');

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