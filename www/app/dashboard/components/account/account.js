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

    .controller('AccountCtrl', [ '$scope', '$ionicModal', 'User', '$ionicLoading', '$ionicPopup', 'Auth', '$state', 'Util', 'currentAuth',
        function($scope, $ionicModal, User, $ionicLoading, $ionicPopup, Auth, $state, Util, currentAuth) {

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


                if (currentAuth.provider === 'facebook'){

                    var alertPopup = $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Looks like you logged in with facebook. You can only change ' +
                            'your password if you logged in with your email.'
                    });

                    alertPopup.then(function (res) {
                        $scope.closeModal();
                    });
                }

                Util.showLoading();

                try {

                    Auth.$changePassword({
                        email: currentAuth[currentAuth.provider].email,
                        oldPassword: user.oldPassword,
                        newPassword: user.newPassword
                    }).then(
                        function () {
                            Util.hideLoading();
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success!',
                                template: 'Password changed successfully.'
                            });
                            alertPopup.then(function (res) {
                                $scope.closeModal();
                                Auth.$unauth();
                                $state.go('home');
                            });
                        }
                    ).catch(function (error) {
                            Util.hideLoading();

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
                    Util.hideLoading();
                }
            };

    }]);