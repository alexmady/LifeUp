/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

var days = ['DISARM','SPACE','FLOW', 'ACT', 'BE', 'I'];

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

                var it = days[i];
                var state = 'dashboard.' + it;
                var htmlFile = it  + '.html';
                var controller = days[i] + 'Ctrl';
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
        }]);


for (var i = 0; i < days.length; i++) {

    (function(courseModule, n) {

        var controller = days[n] + 'Ctrl';
        console.log(controller);

        courseModule.controller(controller, [ '$scope', '$state', '$ionicSlideBoxDelegate', 'User',
            function($scope, $state, $ionicSlideBoxDelegate, User){

            $scope.go = function(){
                $state.go('dashboard.course');
            };

            $scope.slideHasChanged = function(index){
                if ( ($ionicSlideBoxDelegate.slidesCount()-1) === index ){
                    console.log('Last slide');
                    $scope.lastSlide = true;
                }
                User.updateCourseProgress($scope.courseModule, (index+1));
            };

            $scope.init = function (){
                User.updateCourseProgress($scope.courseModule, 1);
            };

            $scope.lastSlide = false;
            $scope.courseModule = n+1;
            $scope.init();

        }]);

    })(courseModule, i);
}


/*

$scope.slideChanged = function(index) {
    var slides = $ionicSlideBoxDelegate.slidesCount();
    var increment = $document[0].getElementsByClassName('increment');
    increment[0].style.width = (1+19*index/(slides-1))*5+'%';
};*/