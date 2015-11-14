/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.emailSignIn', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('emailSignIn', {
                url: '/emailSignIn',
                templateUrl: 'app/emailSignIn/emailSignIn.html',
                controller: 'EmailSignInCtrl'
            })
    }])

    .controller('EmailSignInCtrl', [ '$scope', '$rootScope', '$state', 'Auth', '$ionicHistory',
        function($scope, $rootScope, $state, Auth, $ionicHistory) {

        $scope.go = function(goTo){
            $state.go(goTo)
        }

        $scope.goBack = function(){
            $ionicHistory.goBack();
        }

        $scope.login = function(user){
            Auth.login(user);
        }

    }]);