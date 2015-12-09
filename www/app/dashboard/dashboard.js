/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.dashboard', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                abstract: true,
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardCtrl'
            })
    }])

    .controller('DashboardCtrl', [ '$scope', 'User', '$ionicSideMenuDelegate', function($scope, User) {



        $scope.$watch(function(){return User.userData}, function( newVal, oldVal){

            if (newVal) {
                $scope.authData = newVal.authData;
            }
        },true );


    }]);