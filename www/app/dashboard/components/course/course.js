/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

var days = ['DISARM', 'SPACE', 'FLOW', 'ACT', 'BE', 'I'];

var courseModule = angular.module('lifeUp.course', [ 'Auth']);

courseModule

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('dashboard.course', {
                url: '/course',
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/course/course.html",
                        controller: 'CourseCtrl'
                    }
                }
            });
    }])

    .controller('CourseCtrl', [ '$scope', '$state', '$window',
        function ($scope, $state, $window) {

            TweenMax.ticker.fps(30);

            console.log('CourseController.......');

            $scope.go = function (goTo) {
                $state.go(goTo);
            };

            $scope.debug = function () {
                console.log('---------------------------------------');
                console.log('debug');
                console.log('Window width: ' + $window.innerWidth);
                console.log('Window Height: ' + $window.innerHeight);
                console.log('Sprite: ' + $scope.spritePNGFile);
                console.log('Sprite Data File' + $scope.spriteDataFileName);
                console.log('Sprite Size W: ' + $scope.spriteMeta.size.w);
                console.log('Sprite Size H: ' + $scope.spriteMeta.size.h);
                console.log('Sprite image: ' + $scope.spriteMeta.image);
                console.log('Device Pixel Ratio: ' + $scope.devicePixelRatio);

                console.log('---------------------------------------');
            };


            $scope.devicePixelRatio = $window.devicePixelRatio;
            $scope.spritePNGFile = '../img/sprite-' + $window.innerWidth + 'x' + $window.innerHeight + '.png';
            $scope.spriteDataFileName = '../img/sprite-' + $window.innerWidth + 'x' + $window.innerHeight + '.json';

            if ($scope.devicePixelRatio === 2) {
                var w2 = ($window.innerWidth * 2);
                var h2 = ($window.innerHeight * 2);
                $scope.spritePNGFile = '../img/sprite-' + w2 + 'x' + h2 + '.png';
                $scope.spriteDataFileName = '../img/sprite-' + w2 + 'x' + h2 + '.json';
            }

            $.ajaxSetup({async: false});
            // Your $.getJSON() request is now synchronous...

            $scope.items = [];
            $.getJSON($scope.spriteDataFileName, function (data) {

                $scope.spriteMeta = data.meta;

                $.each(data, function (key, val) {
                    $.each(data[key], function (k, v) {
                        if (v.frame) {
                            var posInfo = {};
                            var scale = $scope.devicePixelRatio;
                            posInfo.bp = '-' + v.frame.x / scale + 'px -' + v.frame.y / scale + 'px';
                            posInfo.w = v.frame.w / scale + 'px';
                            posInfo.h = v.frame.h / scale + 'px';
                            posInfo.t = v.spriteSourceSize.y / scale + 'px';
                            posInfo.l = v.spriteSourceSize.x / scale + 'px';
                            $scope.items.push(posInfo);
                            //console.log(posInfo);
                        }
                    });
                });
            });

            $.ajaxSetup({async: true});

            $scope.bgSizeW = $scope.spriteMeta.size.w / 2 + 'px';
            $scope.bgSizeH = $scope.spriteMeta.size.h / 2 + 'px';


            $scope.currentPosition = 0;

            $scope.play = function () {
                if ($scope.currentPosition + 1 >= steps.length) {return;}
                console.log('play');
                $scope.currentPosition++;
                var data = steps[$scope.currentPosition];
                tweenTo(data.frame, data.duration, boxyTweenComplete, false);
                console.log('currentPosition: ' + $scope.currentPosition);
            };


            $scope.skipForward = function () {
                if ($scope.currentPosition + 1  >= steps.length) { return; }
                var frame = steps[$scope.currentPosition + 1].frame;
                $scope.currentPosition++;
                console.log($scope.currentPosition);
                tweenTo(frame, 0, boxyTweenComplete, true);
            };

            $scope.skipBackwards = function () {
                if ($scope.currentPosition === 0) { return; }
                var frame = steps[$scope.currentPosition - 1].frame;
                $scope.currentPosition--;
                tweenTo(frame, 0, boxyTweenComplete, true);
            };



            var steps = [
                {frame: 0, duration: 0},
                {frame: 208, duration: 6},
                {frame: 345, duration: 5},
                {frame: 520, duration: 6},
                {frame: 592, duration: 5},
                {frame: 654, duration: 2}
             ];


            var boxyObj1 = { counter: 0};

            var tweenTo = function (frame, time, onComplete, paused) {


                var TweenBoxy = TweenMax.to(boxyObj1, time, {counter: frame, repeat: 0,
                    //ease:SteppedEase.config($scope.items.length), onComplete:boxyTweenComplete, paused:true, onUpdate:boxyTweenUpdate});
                    ease: SteppedEase.config(frame), onComplete: onComplete, paused: paused, onUpdate: boxyTweenUpdate});

                function boxyTweenUpdate() {
                    if (boxyObj1.counter < $scope.items.length) {
                        //      console.log(boxyObj1.counter);
                        var pi = $scope.items[Math.ceil(boxyObj1.counter)];
                        TweenMax.to('.course-background', 0, {
                            backgroundPosition: pi.bp,
                            top: pi.t,
                            left: pi.l,
                            width: pi.w,
                            height: pi.h
                        });
                    }

                };
                return TweenBoxy;

            };


            function boxyTweenComplete() {
                console.log('complete');

            }


        }]);

courseModule
    .config(['$stateProvider', function ($stateProvider) {

        for (var i = 0; i < days.length; i++) {

            var it = days[i];
            var state = 'dashboard.' + it;
            var htmlFile = it + '.html';
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
        }
        ;
    }]);


for (var i = 0; i < days.length; i++) {

    (function (courseModule, n) {

        var controller = days[n] + 'Ctrl';

        courseModule.controller(controller, [ '$scope', '$state', '$ionicSlideBoxDelegate', 'User',
            function ($scope, $state, $ionicSlideBoxDelegate, User) {

                $scope.go = function () {
                    $state.go('dashboard.course');
                };

                $scope.slideHasChanged = function (index) {
                    if (($ionicSlideBoxDelegate.slidesCount() - 1) === index) {
                        $scope.lastSlide = true;
                    }
                    User.updateCourseProgress($scope.courseModule, (index + 1));
                };

                $scope.init = function () {
                    User.updateCourseProgress($scope.courseModule, 1);
                };

                $scope.lastSlide = false;
                $scope.courseModule = n + 1;
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