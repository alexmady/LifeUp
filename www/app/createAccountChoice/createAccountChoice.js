/**
 * Created by alexmady on 06/11/15.
 */
(function(){

    'use strict';

    angular.module('lifeUp.createAccount', [])

        .config( ['$stateProvider', function($stateProvider) {

            $stateProvider
                .state('createAccountChoice', {
                    url: '/createAccountChoice',
                    templateUrl: 'createAccountChoice.html',
                    controller: 'CreateAccountChoiceCtrl',
                    params: {
                        answers: null
                    }
                });
        }])

        .controller('CreateAccountChoiceCtrl', [ '$scope', '$state', '$ionicPopup', 'Auth', 'UserProfile', 'Util', '$stateParams',
            function($scope, $state, $ionicPopup, Auth, UserProfile, Util, $stateParams) {

                $scope.go = function(goTo){
                    $state.go(goTo, {answers: $stateParams.answers});
                };

                $scope.facebookSignup = function(){

                    try {
                        if (!Util.isOnline()){
                            Util.popup('No Internet Connection', 'No internet connection. Please try again when you have an internet connection.', null, $scope);
                            return;
                        }
                    } catch (error){ }

                    Util.showLoading();

                    Util.facebookLogin($stateParams.answers, $scope)
                        .then(function(){
                            Util.hideLoading();
                        }).catch(function(error){
                            Util.hideLoading();
                            if (error.errorCode !== "4201"){ // User cancelled the dialog
                                Util.popup('', error.errorMessage, null, $scope);
                            }
                            $state.go($state.current, {}, {reload: true});
                        });
                };
            }]);
})();

