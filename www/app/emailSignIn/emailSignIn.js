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

    .controller('EmailSignInCtrl', [ '$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {

        $scope.go = function(goTo){
            $state.go(goTo)
        }

        $scope.goBack = function(){
            $scope.go($rootScope.previousState.name);
        }

        $scope.login = function(user){
            console.log(user);
        }

    }]);