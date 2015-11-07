/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.how', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.how', {
                url: "/how",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/how/how.html",
                        controller: 'HowCtrl'
                    }
                }
            })
    }])

    .controller('HowCtrl', [ '$scope', function($scope) {


    }]);