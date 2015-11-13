/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

var days = ['DISARM','SPACE','FLOW', 'ACT', 'BE', 'I'];
//var days = ['SPACE'];

var courseModule = angular.module('lifeUp.course', [ 'Auth']);

courseModule

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('dashboard.course', {
                url: '/course' ,
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/course/course.html" ,
                        controller: 'CourseCtrl'
                    }
                }
            });
    }])

    .controller('CourseCtrl', [ '$scope', '$state', function ($scope, $state) {


        $scope.go = function (goTo) {
            $state.go(goTo);
        };



    }]);




    courseModule

        .config(['$stateProvider', function ($stateProvider) {

            for (var i = 0; i < days.length; i++) {


                console.log('i: ' + i + ' days[i] ' + days[i]);

                var it = days[i];
                var state = 'dashboard.' + it;
                var htmlFile = it  + '.html';

                console.log('creating state: ' + state + ', htmlFile:  ' + htmlFile + ' controller: ' + controller);

                $stateProvider
                    .state(state, {
                        url: '/' + it,
                        views: {
                            'dashboardContent': {
                                templateUrl: "app/dashboard/components/course/" + htmlFile,
                                controller: controller
                            }
                        }
                    });
            };
        }])


//};


for (var i = 0; i < days.length; i++) {

    var controller = days[i] + 'Ctrl';

    courseModule.controller(controller, [ '$state', function($tate){



    }]);
}




