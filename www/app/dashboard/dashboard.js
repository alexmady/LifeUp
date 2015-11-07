/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.dashboard', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardCtrl'
            })
    }])

    .controller('DashboardCtrl', [ '$scope', '$state', function($scope, $state) {

        $scope.go = function(goTo){
            $state.go(goTo)
        }

    }]);