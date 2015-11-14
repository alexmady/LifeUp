/**
 * Created by alexmady on 05/11/15.
 */
'use strict';

angular.module('lifeUp.signInChoice', [])

    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('signInChoice', {
                url: '/signInChoice',
                templateUrl: 'app/signInChoice/signInChoice.html',
                controller: 'SignInChoiceCtrl'
            })
    }])

    .controller('SignInChoiceCtrl', [ '$state', '$scope', 'Auth', 'FIREBASE_URL', '$ionicHistory',
        function($state, $scope, Auth, FIREBASE_URL, $ionicHistory) {

        $scope.go = function( goTo ){
            $state.go( goTo )
        };

        $scope.goBack = function() {
            $ionicHistory.goBack();
        };

        $scope.facebookLogin = function() {
            Auth.facebookLogin();
        };

    }]);