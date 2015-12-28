/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

var days = ['DISARM', 'SPACE', 'FLOW', 'ACT', 'BE', 'I'];

var courseModule = angular.module('lifeUp.course', [ 'ionic']);

courseModule

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('dashboard.course', {
                cache: true,
                url: '/course',
                views: {
                    'dashboardContent': {
                        templateUrl: 'app/dashboard/components/course/course.html',
                        controller: 'CourseCtrl'
                    }
                },
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth", function (Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }],

                    "profile": [ "UserProfile", "Auth", function (UserProfile, Auth) {

                        return UserProfile(Auth.$getAuth().uid).$loaded();

                    }],
                    "imageOptions": ["Util", function(Util){

                        return Util.imageOptions();

                    }]
                }

            });
    }])

    .controller('CourseCtrl',
    [
        '$scope',
        '$state',
        '$window',
        '$ionicHistory',
        '$ionicModal',
        '$ionicSideMenuDelegate',
        '$ionicPopup',
        'UserProfile',
        'currentAuth',
        'courseMetaData',
        'profile',
        'imageOptions',

        function (

            $scope,
            $state,
            $window,
            $ionicHistory,
            $ionicModal,
            $ionicSideMenuDelegate,
            $ionicPopup,
            UserProfile,
            currentAuth,
            courseMetaData,
            profile,
            imageOptions    ) {

            //console.log('course:');
            //console.log(imageOptions);

            $scope.toggleLeft = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };

            var init = function () {

                $scope.items = imageOptions.items;
                $scope.bgSizeW = imageOptions.bgSizeW;
                $scope.bgSizeH = imageOptions.bgSizeH;
                $scope.spritePNGFile = imageOptions.spritePNGFile;
                $scope.hideButtons = false;
                $scope.profile = profile;

                var stepIndex = Math.max($scope.profile.module - 1, 0);
                updateStep(stepIndex, $scope.profile.slide);
                $scope.boxyObj1.counter = $scope.step.frame;

                if (!$scope.profile.completeCongratulate && $scope.profile.courseCompleted) {

                    $scope.blurBackground = true;
                    var alertPopup = $ionicPopup.alert({
                        title: '',
                        cssClass: 'course-label-popup',
                        templateUrl: 'app/dashboard/components/course/popupCourseCompleteTemplate.html'
                    });
                    alertPopup.then(function (res) {
                        $scope.blurBackground = false;
                        $scope.profile.completeCongratulate = true;
                        $scope.profile.$save();
                        $scope.closeModal();
                    });
                }
            };

            TweenMax.ticker.fps(24);

            $scope.go = function (goTo) {
                $state.go(goTo);
            };


            var updateStep = function (index, slide) {
                $scope.step = courseMetaData[index];
                if ($scope.step.pos < $scope.profile.moduleFar) {
                    $scope.forwardButtonEnabled = true;
                } else {
                    $scope.forwardButtonEnabled = false;
                }
                if (slide) {
                    profile.updateCourseProgress($scope.step.pos, slide);
                } else {
                    profile.updateCourseProgress($scope.step.pos, 0);
                }
            };

            function debug() {
                console.log('---------------------------------------');
                console.log('debug');
                console.log('Window width: ' + $window.screen.width);
                console.log('Window Height: ' + $window.screen.height);
                console.log('Sprite: ' + $scope.spritePNGFile);
                console.log('Sprite Data File' + $scope.spriteDataFileName);
                //console.log('Sprite Size W: ' + $scope.spriteMeta.size.w);
                //console.log('Sprite Size H: ' + $scope.spriteMeta.size.h);
                console.log('Sprite image: ' + $scope.spriteMeta.image);
                console.log('Device Pixel Ratio: ' + $scope.devicePixelRatio);
                console.log('---------------------------------------');
            };

            $scope.playButtonWidth = 50;
            $scope.playButtonLeft = (($window.innerWidth / 2) - $scope.playButtonWidth) + 'px';
            $scope.forwardButtonLeft = $window.innerWidth - 50;

            $scope.play = function () {

                $scope.blurBackground = true;
                $scope.badge = $scope.step.badge + '.png';
                $scope.label = 'Labels_' + $scope.step.name + '.png';

                var alertPopup = $ionicPopup.alert({
                    title: $scope.step.name,
                    templateUrl: 'app/dashboard/components/course/popupTemplate.html',
                    cssClass: 'course-label-popup',
                    scope: $scope,
                    buttons: [
                        {
                            text: '<span style="font-weight: bold">Start ' + $scope.step.name + '</span>',
                            type: 'button button-outline button-light'
                        }
                    ]
                });
                alertPopup.then(function (res) {
                    $scope.blurBackground = false;
                    $state.go('dashboard.' + $scope.step.name);
                });
            };

            $scope.climb = function () {
                if ($scope.step + 1 >= steps.length) {
                    return;
                }
                $scope.profile.readyToClimb = false;

                var nextStep = steps[$scope.step.pos];
                profile.updateCourseProgress(nextStep.pos, 0, false);

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

            $scope.openInstructions = function () {
                $scope.openModal();
            };

            $ionicModal.fromTemplateUrl('app/dashboard/components/course/instructions.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function () {
                $scope.modal.remove();
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

            $stateProvider
                .state(state, {
                    cache: false,
                    url: '/' + it,
                    views: {
                        'dashboardContent': {
                            templateUrl: "app/dashboard/components/course/" + htmlFile,
                            controller: controller
                        }
                    },
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        // Auth refers to our $firebaseAuth wrapper in the example above
                        "currentAuth": ["Auth", function (Auth) {
                            // $requireAuth returns a promise so the resolve waits for it to complete
                            // If the promise is rejected, it will throw a $stateChangeError (see above)
                            return Auth.$requireAuth();
                        }],

                        "profile": [ "UserProfile", "Auth", function (UserProfile, Auth) {
                            return UserProfile(Auth.$getAuth().uid).$loaded();
                        }]
                    }
                });
        };
    }]);


for (var i = 0; i < days.length; i++) {

    (function (courseModule, n) {

        var controller = days[n] + 'Ctrl';

        courseModule.controller(controller, [ '$scope', '$state', '$ionicSlideBoxDelegate', 'currentAuth', 'courseMetaData', 'profile', '$ionicPopup',
            function ($scope, $state, $ionicSlideBoxDelegate, currentAuth, courseMetaData, profile, $ionicPopup) {

                $scope.title = days[n];

                $scope.go = function () {
                    $state.go('dashboard.course');
                };

                $scope.completeModule = function () {

                    var slide = $ionicSlideBoxDelegate.currentIndex() + 1;
                    var module = $scope.courseModule;
                    var readyToClimb = true;

                    if ($scope.courseModule === courseMetaData.length && slide === 1) {
                        readyToClimb = false;
                    }

                    if (courseMetaData[module-1].badgeComplete === true){

                        //$scope.blurBackground = true;
                        $scope.badge = courseMetaData[module-1].badge;
                        $scope.blurBackground = true;

                        var alertPopup = $ionicPopup.alert({
                            title: "",
                            templateUrl: 'app/dashboard/components/course/popupBadgeCompleteTemplate.html',
                            cssClass: 'course-label-popup',
                            scope: $scope
                        });
                        alertPopup.then(function (res) {
                            $scope.blurBackground = false;
                            $state.go('dashboard.course');
                        });
                    } else {
                        $state.go('dashboard.course');
                    }
                    profile.updateCourseProgress(module, slide, readyToClimb);

                };

                $scope.slideHasChanged = function (index) {
                    if (($ionicSlideBoxDelegate.slidesCount() - 1) === index) {
                        $scope.enableCompleteButton = true;
                        $scope.animateCompleteButton = "animated pulse";
                    } else {
                        $scope.enableCompleteButton = false;
                        $scope.animateCompleteButton = "";
                    }
                    profile.updateCourseProgress($scope.courseModule, (index + 1), false);
                };


                var init = function () {


                    $scope.userActiveSlide = 0;

                    if (profile.slide > 0) {
                        $scope.userActiveSlide = profile.slide - 1;
                    }

                    $scope.courseModule = profile.module;
                    //console.log('course module:' + $scope.courseModule);
                    //console.log('user active slide:' + $scope.userActiveSlide + ' slide count:' + n);
                    //console.log(courseMetaData[$scope.courseModule - 1].length);


                    if ($scope.userActiveSlide === (courseMetaData[$scope.courseModule - 1].length - 1)) {
                        $scope.enableCompleteButton = true;
                        $scope.animateCompleteButton = "animated pulse";

                    } else {
                        $scope.enableCompleteButton = false;
                        $scope.animateCompleteButton = "";

                    }


                    setTimeout(function () {
                        $ionicSlideBoxDelegate.slide($scope.userActiveSlide, 0);
                    }, 100);

                    profile.updateCourseProgress($scope.courseModule, $scope.userActiveSlide + 1, false);


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