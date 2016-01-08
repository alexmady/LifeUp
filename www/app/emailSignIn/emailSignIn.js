/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.emailSignIn', [])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('emailSignIn', {
                cache: false,
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


            var popupNoInternetConnection = function(){
                Util.popup('No Internet Connection', 'You need to be connected to the internet to sign in. Please try again when you have a connection.', null, $scope);
            };

            $scope.facebookLogin = function () {

                try {
                    if (!Util.isOnline()){
                        popupNoInternetConnection();
                        return;
                    }

                } catch ( error ){ }


                Util.showLoading();
                Util.facebookLogin(null, $scope)
                    .then(function(){
                        console.log('logged in with facebook');
                        Util.hideLoading();
                    }).catch(function(error){
                        Util.hideLoading();
                        console.log(error);
                        Util.popup('', error, null, $scope);
                    });
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

                try {
                    if (!Util.isOnline()){
                        popupNoInternetConnection();
                        return;
                    }
                } catch (error){  }

                Util.showLoading();

                try{
                    Auth.$resetPassword({email:user.email}).then(
                        function () {
                            Util.hideLoading();
                            $scope.blurBackground = true;

                            var msg = 'Password reset email sent. Please check your email!';

                            var alertPopup = $ionicPopup.alert({
                                title: 'Done!',
                                template: '<p class="lifeup-earnt-badge center" style="text-align: center">'+msg+'</p>',
                                cssClass: 'course-label-popup'
                            });

                            alertPopup.then(function (res) {
                                $scope.blurBackground = false;
                                $scope.closeModal();
                                Auth.$unauth();
                                $state.go('emailSignIn');
                            });
                        }
                    ).catch(function (error) {
                            Util.hideLoading();
                            Util.popup("ERROR", error, null, $scope);
                        });

                } catch (error){
                    console.error(error);
                    Util.hideLoading();
                    Util.popup("ERROR", "Oh dear! Something went wrong... <br> Please check you entered your email address!", null, $scope);
                }
            };

            $scope.goBack = function () {
                $ionicHistory.goBack();
            };

            $scope.login = function (user) {

                try {
                    if (!Util.isOnline()){
                        popupNoInternetConnection();
                        return;
                    }
                } catch (error){  }

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
                        Util.popup("ERROR", 'Error: Please check you entered a valid email and password.', null, $scope);
                    });
                } catch (error){

                    Util.hideLoading();
                    Util.popup("ERROR", "Oh dear! Something went wrong... <br> Please check you specified your email and password correctly!", null, $scope);
                }

             };

        }]);