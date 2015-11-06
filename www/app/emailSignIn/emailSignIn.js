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

    .controller('EmailSignInCtrl', [ '$scope', '$state', function($scope, $state) {

        $scope.go = function(goTo){
            $state.go(goTo)
        }

        $scope.login = function(user){
            console.log(user);
        }

    }]);