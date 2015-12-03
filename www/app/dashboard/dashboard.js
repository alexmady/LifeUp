/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.dashboard', [ 'Auth'])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                abstract: true,
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardCtrl'
            })
    }])

    .controller('DashboardCtrl', [ '$scope', 'Auth', 'User', '$ionicSideMenuDelegate', function($scope, Auth, User, $ionicSideMenuDelegate) {

        $scope.logout = function(){
            Auth.logout();
        };

        $scope.$watch(function(){return User.userData}, function( newVal, oldVal){

            console.log('Dashboard new user data');
            console.log(newVal);

            if (newVal) {

                console.log('Dashboard new user data');

                $scope.authData = newVal.authData;
            }
        },true );


    }]);