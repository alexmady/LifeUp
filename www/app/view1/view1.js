/**
 * Created by alexmady on 05/11/15.
 */
'use strict';

angular.module('lifeUp.view1', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('view1', {
                url: '/view1',
                templateUrl: 'app/view1/view1.html',
                controller: 'View1Ctrl'
            })
    }])

    .controller('View1Ctrl', [function() {

    }]);