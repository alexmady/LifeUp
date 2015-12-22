/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.account', [ ])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('dashboard.account', {
                cache: false,
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

    .controller('AccountCtrl', [ '$scope', '$ionicModal', '$ionicPopup', 'Auth', '$state', 'Util', 'currentAuth',
        function ($scope, $ionicModal, $ionicPopup, Auth, $state, Util, currentAuth) {

            $ionicModal.fromTemplateUrl('app/dashboard/components/account/changePassword.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.showChangePasswordModal = function () {

                if (currentAuth.provider === 'facebook'){

                    var alertPopup = $ionicPopup.alert({
                        title: 'Erm...!',
                        template: '<p class="lifeup-earnt-badge center" style="text-align: center">' +
                            'Looks like you logged in with facebook. You can only change ' +
                            'your password if you logged in with your email.</p>',
                        cssClass: 'course-label-popup'
                    });

                    alertPopup.then(function (res) {
                        $scope.closeModal();
                    });
                } else {
                    $scope.modal.show();
                }
            };

            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

            $scope.logout = function () {
                Auth.$unauth();
                $state.go('home');
            };

            $scope.changePassword = function (user) {


                Util.showLoading();

                try {

                    Auth.$changePassword({
                        email: currentAuth[currentAuth.provider].email,
                        oldPassword: user.oldPassword,
                        newPassword: user.newPassword
                    }).then(
                        function () {
                            Util.hideLoading();
                            var msg = 'Password changed successfully. Please log in with you new password.';

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success!',
                                template: '<p class="lifeup-earnt-badge center" style="text-align: center">' + msg + '</p>',
                                cssClass: 'course-label-popup'
                            });
                            alertPopup.then(function (res) {
                                $scope.closeModal();
                                Auth.$unauth();
                                $state.go('home');
                            });
                        }
                    ).catch(function (error) {
                            Util.hideLoading();
                            Util.popup('', 'Error: Please make sure you have specified your old password correctly and a new password.', null, $scope);
                        });
                } catch (error) {
                    console.log(error.stack);
                    Util.hideLoading();
                }

            };

        }]);