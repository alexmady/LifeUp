/**
 * Created by alexmady on 04/12/15.
 */
'use strict';

angular.module('lifeUp.dashboardHome', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.dashboardHome', {
                url: "/faq",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/home/dashboardHome.html",
                        controller: 'DashHomeCtrl'
                    }
                }
            })
    }])

    .controller('DashHomeCtrl', [ '$scope', function($scope) {


    }]);