/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.emailLogin', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('emailLogin', {
                url: '/emailLogin',
                templateUrl: 'app/emailLogin/emailLogin.html',
                controller: 'EmailLoginCtrl'
            })
    }])

    .controller('EmailLoginCtrl', [ '$scope', '$state', function($scope, $state) {

        $scope.go = function(goTo){
            $state.go(goTo)
        }

    }]);