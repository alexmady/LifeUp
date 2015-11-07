/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.faq', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.faq', {
                url: "/faq",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/faq/faq.html",
                        controller: 'FaqCtrl'
                    }
                }
            })
    }])

    .controller('FaqCtrl', [ '$scope', function($scope) {


    }]);