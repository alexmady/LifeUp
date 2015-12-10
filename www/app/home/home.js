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

    .controller('HomeCtrl',
        [ '$scope', '$state', function($scope, $state) {

            $scope.go = function(goTo){
            try{
                $state.go(goTo);
            } catch(error){
                console.log(error.stack);
            }
        };
    }]);