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

    .controller('CreateAccountChoiceCtrl', [ '$scope', '$rootScope', '$state', 'FIREBASE_URL', '$ionicHistory',
        function($scope, $rootScope, $state, FIREBASE_URL, $ionicHistory) {

        $scope.go = function(goTo){
            $state.go(goTo)
        };

        $scope.goBack = function(){
            $ionicHistory.goBack();
        };

        $scope.facebookSignup = function(){

        };


    }]);