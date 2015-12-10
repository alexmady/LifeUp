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
                controller: 'DashboardCtrl',
                resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth", function (Auth) {
                        // $waitForAuth returns a promise so the resolve waits for it to complete
                        return Auth.$requireAuth();
                    }]
                }
            })
    }])

    .controller('DashboardCtrl', [ '$scope', 'Auth', function($scope, Auth) {

        Auth.$onAuth(function(data){
            $scope.authData = data;
        });

    }]);