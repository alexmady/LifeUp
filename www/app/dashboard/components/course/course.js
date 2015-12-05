/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

var days = ['DISARM', 'SPACE', 'FLOW', 'ACT', 'BE', 'I'];

var courseModule = angular.module('lifeUp.course', [ 'Auth', 'ionic']);

courseModule

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('dashboard.course', {
                cache: false,
                url: '/course',
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/course/course.html",
                        controller: 'CourseCtrl'
                    }
                }
            });
    }])

    .controller('CourseCtrl', [ '$scope', '$state', '$window', 'User', '$ionicHistory', '$ionicModal', '$ionicSideMenuDelegate',
        function ($scope, $state, $window, User, $ionicHistory, $ionicModal, $ionicSideMenuDelegate) {

            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
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


            var init = function () {

                var promise = User.getProfile();

                promise.then(function (prof) {

                    $scope.profile = prof;
                    updateStep(Math.max(prof.module - 1, 0), prof.slide);
                    $scope.boxyObj1.counter = $scope.step.frame;

                    if ($scope.profile.readyToClimb) {
                        $scope.profile.showPlayButton = false;
                    } else {
                        $scope.profile.showPlayButton = true;
                    }

                });
            };

            TweenMax.ticker.fps(30);

            $scope.go = function (goTo) {
                $state.go(goTo);
            };

            var steps = User.courseSteps();

            var updateStep = function (index, slide) {
                $scope.step = steps[index];
                if ($scope.step.pos < $scope.profile.moduleFar) {
                    $scope.forwardButtonEnabled = true;
                } else {
                    $scope.forwardButtonEnabled = false;
                }
                if (slide) {
                    User.updateCourseProgress($scope.step.pos, slide);
                } else {
                    User.updateCourseProgress($scope.step.pos, 0);
                }
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
            $scope.playButtonLeft = (($window.innerWidth / 2) - $scope.playButtonWidth) + 'px';
            $scope.forwardButtonLeft = $window.innerWidth - 50;

            $scope.play = function () {
                $state.go('dashboard.' + $scope.step.name);
            };

            $scope.climb = function () {
                if ($scope.step + 1 >= steps.length) {
                    return;
                }
                $scope.profile.readyToClimb = false;

                var nextStep = steps[$scope.step.pos];
                User.updateCourseProgress(nextStep.pos, 0, false);

                var onCompleteClimb = function () {
                    updateStep($scope.step.pos);
                    $scope.boxyTweenComplete();
                };
                tweenTo(nextStep.frame, nextStep.duration, onCompleteClimb, false);
            };

            $scope.skipForward = function () {
                if ($scope.step.pos >= steps.length) {
                    return;
                }
                if ($scope.step.pos + 1 > $scope.profile.moduleFar) {
                    return;
                }
                updateStep($scope.step.pos);
                tweenTo($scope.step.frame, 0, $scope.boxyTweenComplete, true);
            };

            $scope.skipBackwards = function () {
                if ($scope.step.pos === 1) {
                    return;
                }
                updateStep($scope.step.pos - 2)
                $scope.boxyObj1.counter = $scope.step.frame;
                tweenTo($scope.step.frame, 0, $scope.boxyTweenComplete, true);
            };

            var steps = [
                {name: 'DISARM', pos: 1, frame: 0, duration: 0, backButtonEnabled: false},
                {name: 'SPACE', pos: 2, frame: 208, duration: 6, backButtonEnabled: true},
                {name: 'FLOW', pos: 3, frame: 345, duration: 5, backButtonEnabled: true},
                {name: 'ACT', pos: 4, frame: 520, duration: 6, backButtonEnabled: true},
                {name: 'BE', pos: 5, frame: 592, duration: 5, backButtonEnabled: true},
                {name: 'I', pos: 6, frame: 654, duration: 2, backButtonEnabled: true}
            ];

            $scope.boxyObj1 = { counter: 0 };

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

            $scope.boxyTweenComplete = function () {
                $scope.profile.showPlayButton = true;
                $scope.profile.readyToClimb = false;
                $scope.profile.$save();
            };

            $scope.openInstructions = function(){
                $scope.openModal();
            };

            $ionicModal.fromTemplateUrl('app/dashboard/components/course/instructions.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function() {
                $scope.modal.show();
            };
            $scope.closeModal = function() {
                $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function() {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function() {
                // Execute action
            });



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
                    cache: false,
                    url: '/' + it,
                    views: {
                        'dashboardContent': {
                            templateUrl: "app/dashboard/components/course/" + htmlFile,
                            //template: '<course-page></course-page>',
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

                $scope.title = days[n];

                $scope.go = function () {
                    $state.go('dashboard.course');
                };

                $scope.completeModule = function () {
                    console.log('completing module...');
                    User.updateCourseProgress($scope.courseModule, ($ionicSlideBoxDelegate.currentIndex() + 1), true);
                    $state.go('dashboard.course');
                };

                $scope.slideHasChanged = function (index) {
                    if (($ionicSlideBoxDelegate.slidesCount() - 1) === index) {

                        $scope.enableCompleteButton = true;
                    } else {
                        $scope.enableCompleteButton = false;
                    }
                    User.updateCourseProgress($scope.courseModule, (index + 1), false);
                };

                var init = function () {

                    var promise = User.getProfile();

                    promise.then(function (profile) {

                        $scope.userActiveSlide = 0;

                        if (profile.slide > 0) {
                            $scope.userActiveSlide = profile.slide - 1;
                        }

                        $scope.courseModule = profile.module;

                        console.log('course module:' + $scope.courseModule);
                        console.log('user active slide:' + $scope.userActiveSlide + ' slide count:' + n);

                        console.log(User.courseSteps()[$scope.courseModule - 1].length);


                        if ($scope.userActiveSlide === (User.courseSteps()[$scope.courseModule - 1].length - 1)) {
                            $scope.enableCompleteButton = true;
                        } else {
                            $scope.enableCompleteButton = false;
                        }


                        setTimeout(function(){
                            $ionicSlideBoxDelegate.slide($scope.userActiveSlide,0);
                        },0);

                        User.updateCourseProgress($scope.courseModule, $scope.userActiveSlide + 1, false);


                    });


                };

                init();

            }]);

    })(courseModule, i);
}

courseModule.directive('coursePage', function () {
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