/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

var days = ['DISARM', 'SPACE', 'FLOW', 'ACT', 'BE', 'I'];

var courseModule = angular.module('lifeUp.course', [ 'Auth','ionic']);

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

    .controller('CourseCtrl', [ '$scope', '$state', '$window','User','$rootScope',
        function ($scope, $state, $window, User, $rootScope) {

            var init = function(){

                $scope.profile = User.getProfile();

                $scope.profile.$loaded(function(){
                    console.log('user profile loaded');
                    console.log($scope.profile);
                    console.log('User: '+ $scope.profile.email);

                    $scope.playButtonTop = ($window.innerHeight - 60) +'px';
                    $scope.playButtonLeft = ($window.innerWidth * 0.2) + 'px';
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


                    $scope.step = steps[$scope.profile.module-1];
                    $scope.boxyObj1.counter = $scope.step.frame;

                    if($scope.profile.readyToClimb){
                        $scope.profile.showPlayButton = false;
                    } else {
                        $scope.profile.showPlayButton = true;
                    }


                });

                $scope.profile.$watch(function(data){
                    console.log('$scope.profile.$watch');
                    if ($scope.profile.readyToClimb){
                        $scope.profile.showPlayButton = false;
                    }
                });
            };

            TweenMax.ticker.fps(30);

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

            $scope.playButtonWidth = 50;
            $scope.playButtonLeft = (($window.innerWidth/2)-$scope.playButtonWidth) + 'px';
            $scope.forwardButtonLeft = $window.innerWidth - 50;

            $scope.play = function () {
                $state.go('dashboard.' + $scope.step.name);
            };

            $scope.climb = function(){
                if ($scope.step + 1 >= steps.length) {return;}
                User.updateCourseProgress($scope.step.pos, 0, false);
                $scope.step = steps[$scope.step.pos]; // pos is index of steps array + 1!
                tweenTo($scope.step.frame, $scope.step.duration, $scope.boxyTweenComplete, false);
            };

            $scope.skipForward = function () {
                if ($scope.step.pos  >= steps.length) { return; }
                $scope.step = steps[$scope.step.pos]; // pos is index of steps array + 1!
                tweenTo($scope.step.frame, 0, $scope.boxyTweenComplete, true);
            };

            $scope.skipBackwards = function () {
                if ($scope.step.pos === 1) { return; }
                $scope.step = steps[$scope.step.pos - 2];
                tweenTo($scope.step.frame, 0, $scope.boxyTweenComplete, true);
            };

            var steps = [
                {name: 'DISARM', pos: 1, frame: 0, duration: 0, backButtonEnabled: false, forwardButtonEnabled: true},
                {name: 'SPACE', pos: 2, frame: 208, duration: 6, backButtonEnabled: true, forwardButtonEnabled: true},
                {name: 'FLOW',  pos: 3,frame: 345, duration: 5, backButtonEnabled: true, forwardButtonEnabled: true},
                {name: 'ACT', pos: 4,frame: 520, duration: 6, backButtonEnabled: true, forwardButtonEnabled: true},
                {name: 'BE', pos: 5,frame: 592, duration: 5, backButtonEnabled: true, forwardButtonEnabled: true},
                {name: 'I', pos: 6,frame: 654, duration: 2, backButtonEnabled: true, forwardButtonEnabled: false}
             ];

            $scope.boxyObj1 = { counter: 0};

            var tweenTo = function (frame, time, onComplete, paused) {


                var TweenBoxy = TweenMax.to($scope.boxyObj1, time, {counter: frame, repeat: 0,
                    //ease:SteppedEase.config($scope.items.length), onComplete:boxyTweenComplete, paused:true, onUpdate:boxyTweenUpdate});
                    ease: SteppedEase.config(frame), onComplete: onComplete, paused: paused, onUpdate: boxyTweenUpdate});

                function boxyTweenUpdate() {
                    if ($scope.boxyObj1.counter < $scope.items.length) {
                        //      console.log(boxyObj1.counter);
                        var pi = $scope.items[Math.ceil($scope.boxyObj1.counter)];
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

            $scope.boxyTweenComplete = function() {
                console.log('Tween complete');
                $scope.profile.showPlayButton = true;
                $scope.profile.$save();
            };

            init();
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
                            templateUrl: "app/dashboard/components/course/coursePage.html",
                            //template: '<course-page></course-page>',
                            controller: controller
                        }
                    }
                });
        };
    }]);


for (var i = 0; i < days.length; i++) {

    (function (courseModule, n) {

        var controller = days[n] + 'Ctrl';

        courseModule.controller(controller, [ '$scope', '$state', '$ionicSlideBoxDelegate', 'User', '$rootScope',
            function ($scope, $state, $ionicSlideBoxDelegate, User, $rootScope) {

                $scope.title = days[n];

                $scope.go = function () {
                    $state.go('dashboard.course');
                };

                $scope.completeModule = function(){
                    User.updateCourseProgress($scope.courseModule, ($ionicSlideBoxDelegate.currentIndex()+1), true);
                    $state.go('dashboard.course');
                };

                $scope.slideHasChanged = function (index) {
                    if (($ionicSlideBoxDelegate.slidesCount() - 1) === index) {
                        $scope.lastSlide = true;
                    } else {
                        $scope.lastSlide = false;
                    }
                    User.updateCourseProgress($scope.courseModule, (index + 1), false);
                };

                $scope.init = function () {
                    User.updateCourseProgress($scope.courseModule, 1, false);
                };

                $scope.lastSlide = false;
                $scope.courseModule = n + 1;
                $scope.init();

            }]);

    })(courseModule, i);
}

courseModule.directive('coursePage', function() {
    return {
        templateUrl: 'app/dashboard/components/course/coursePage.html'
    };
});
/*

 $scope.slideChanged = function(index) {
 var slides = $ionicSlideBoxDelegate.slidesCount();
 var increment = $document[0].getElementsByClassName('increment');
 increment[0].style.width = (1+19*index/(slides-1))*5+'%';
 };*/