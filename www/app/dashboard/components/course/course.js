/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.course', [ 'Auth'])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.course', {
                url: "/course",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/course/course.html",
                        controller: 'CourseCtrl'
                    }
                }
            })
    }])

    .controller('CourseCtrl', [ '$scope', 'Auth', 'User', '$ionicSideMenuDelegate', function($scope, Auth, User, $ionicSideMenuDelegate) {


    }]);