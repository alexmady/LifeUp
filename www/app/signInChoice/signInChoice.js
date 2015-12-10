/**
 * Created by alexmady on 05/11/15.
 */
'use strict';

angular.module('lifeUp.signInChoice', [])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('signInChoice', {
                url: '/signInChoice',
                templateUrl: 'app/signInChoice/signInChoice.html',
                controller: 'SignInChoiceCtrl'
            })
    }])

    .controller('SignInChoiceCtrl', [ '$state', '$scope', 'FIREBASE_URL', '$ionicHistory', '$ionicLoading', 'User', '$ionicPopup',
        function ($state, $scope, FIREBASE_URL, $ionicHistory, $ionicLoading, User, $ionicPopup) {

            $scope.go = function (goTo) {
                $state.go(goTo)
            };

            $scope.goBack = function () {
                $ionicHistory.goBack();
            };

            $scope.facebookLogin = function () {

                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });

                User.facebookLogin().then(function(authData){
                    $ionicLoading.hide();
                }).catch(function(error){
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

        }]);