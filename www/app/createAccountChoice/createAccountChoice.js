/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.createAccount', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('createAccountChoice', {
                url: '/createAccountChoice',
                templateUrl: 'app/createAccountChoice/createAccountChoice.html',
                controller: 'CreateAccountChoiceCtrl'
            })
    }])

    .controller('CreateAccountChoiceCtrl', [ '$scope', '$state', '$ionicLoading', 'User', '$ionicPopup',
        function($scope, $state, $ionicLoading, User, $ionicPopup) {

        $scope.go = function(goTo){
            $state.go(goTo)
        };

        /*$scope.facebookSignup = function(){

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
        }*/

    }]);