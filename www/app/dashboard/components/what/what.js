/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.what', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.what', {
                url: "/what",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/what/what.html",
                        controller: 'WhatCtrl'
                    }
                }
            })
    }])

    .controller('WhatCtrl', [ '$scope', function($scope) {


    }]);