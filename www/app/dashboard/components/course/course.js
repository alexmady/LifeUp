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


        $scope.play = function (){
            TweenBoxy.play();
        };

        $scope.pause = function (){
            TweenBoxy.pause();
        };

        $scope.restart = function (){
            console.log('restarting');
            TweenBoxy.restart();
        };


        var boxyObj1 = { counter: 0};
        var boxyArray1 = [];

        var noImages = 10;
        var deviceWidth = 375;
        var deviceHeight = 667;
        var imagesPerRow = 9;

        var count = 1;
        var row = 0;


        for ( var i = 0; i < noImages; i++ ){

            if (count >= imagesPerRow){
                count = 0;
                row = row + 1;
            }
            var x = '-' + ( count * deviceWidth ) + 'px';
            var y = '-' + ( deviceHeight * row) + 'px';
            var dim =  x + ' '+ y;
            console.log( count + '-->' + dim);
            boxyArray1[i-1] = dim
            count = count + 1;
        }
        console.log(boxyArray1.length);

        var TweenBoxy = TweenMax.to(boxyObj1, 2.2, {counter:boxyArray1.length, repeat:0, ease:SteppedEase.config(boxyArray1.length), onComplete:boxyTweenComplete, paused:true, onUpdate:boxyTweenUpdate});

        function boxyTweenUpdate(){
            if (boxyObj1.counter < boxyArray1.length){
                console.log(boxyObj1.counter);
                TweenMax.to('.course-background', 0, {backgroundPosition:boxyArray1[Math.ceil(boxyObj1.counter)]});
            } else {
                console.log('else ' + boxyObj1.counter);

            }
        }

        function boxyTweenComplete(){
            console.log('complete');
            console.log(boxyArray1[boxyArray1.length-1]);
          //  TweenMax.to('.course-background', {backgroundPosition:'-2248px -4669px', immediateRender:true});
        }





    }]);

    courseModule
        .config(['$stateProvider', function ($stateProvider) {

            for (var i = 0; i < days.length; i++) {

                var it = days[i];
                var state = 'dashboard.' + it;
                var htmlFile = it  + '.html';
                var controller = days[i] + 'Ctrl';
                //console.log('creating state: ' + state + ', htmlFile:  ' + htmlFile + ' controller: ' + controller);

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

        courseModule.controller(controller, [ '$scope', '$state', '$ionicSlideBoxDelegate', 'User',
            function($scope, $state, $ionicSlideBoxDelegate, User){

            $scope.go = function(){
                $state.go('dashboard.course');
            };

            $scope.slideHasChanged = function(index){
                if ( ($ionicSlideBoxDelegate.slidesCount()-1) === index ){
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