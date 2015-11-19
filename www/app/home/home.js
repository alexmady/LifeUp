/**
 * Created by alexmady on 05/11/15.
 */
'use strict';

angular.module('lifeUp.home', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/home/home.html',
                controller: 'HomeCtrl'
            })
    }])

    .controller('HomeCtrl', [ '$scope', '$state', '$ionicHistory', function($scope, $state, $ionicHistory) {

        $scope.go = function(goTo){
            $state.go(goTo);
        }

    }]);