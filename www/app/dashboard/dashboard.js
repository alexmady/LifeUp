/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.dashboard', [ 'Auth'])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardCtrl'
            })
    }])

    .controller('DashboardCtrl', [ '$scope', 'Auth', 'User', function($scope, Auth, User) {

        $scope.logout = function(){
            Auth.logout();
        };

        $scope.$watch(function(){return User.authData}, function( newVal, oldVal){

            if (newVal) {
                console.log('auth data scope updated with');
                $scope.authData = newVal;
                console.log($scope.authData);
            }
        },true );

    }]);