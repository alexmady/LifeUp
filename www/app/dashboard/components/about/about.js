/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.about', [ 'Auth'])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.about', {
                url: "/about",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/about/about.html",
                        controller: 'AboutCtrl'
                    }
                }
            })
    }])

    .controller('AboutCtrl', [ '$scope', function($scope) {


    }]);