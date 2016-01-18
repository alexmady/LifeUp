(function () {
    'use strict';

    var days = ['DISARM', 'SPACE', 'FLOW', 'ACT', 'BE', 'I'];

    var courseModule = angular.module('lifeUp.course', [ 'ionic']);

    courseModule

        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider
                .state('dashboard.course', {
                    url: '/course',
                    cache: false,
                    views: {
                        'dashboardContent': {
                            templateUrl: 'course.html',
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
                        "profile": [ "UserProfile", "Auth", function (userProfile, Auth) {
                            return userProfile(Auth.$getAuth().uid).$loaded();
                        }],
                        "imageOptions": ["Util", function (Util) {
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

            function ($scope, $state, $window, $ionicHistory, $ionicModal, $ionicSideMenuDelegate, $ionicPopup, UserProfile, currentAuth, courseMetaData, profile, imageOptions) {

                $scope.toggleLeft = function () {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                $scope.$on('$ionicView.enter', function () {

                    $scope.bgSizeW = imageOptions.bgSizeW;
                    $scope.bgSizeH = imageOptions.bgSizeH;
                    $scope.spritePNGFile = imageOptions.spritePNGFile;
                    $scope.boxyObj1 = { counter: 0 };
                    $scope.profile = profile;

                    var stepIndex = Math.max($scope.profile.module - 1, 0);
                    updateStep(stepIndex, $scope.profile.slide);

                    $scope.boxyObj1.counter = $scope.step.frame;

                });

                // correct any error of showing buttons.
                if (profile.showPlayButton === profile.readyToClimb) {
                    // default to showing the play button
                    profile.readyToClimb = false;
                    profile.showPlayButton = true;
                    profile.$save();
                }


                $scope.go = function (goTo) {
                    $state.go(goTo);
                };

                function updateStep(index, slide) {
                    $scope.step = courseMetaData[index];
                    $scope.item = imageOptions.items[$scope.step.frame];
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
                }


                $scope.play = function () {

                    $scope.badge = $scope.step.badge + '.png';
                    $scope.label = 'Labels_' + $scope.step.name + '.png';

                    var alertPopup = $ionicPopup.alert({
                        title: $scope.step.name,
                        templateUrl: 'popupTemplate.html',
                        cssClass: 'course-label-popup',
                        scope: $scope,
                        buttons: [
                            {
                                text: '<span style="font-weight: bold">Start ' + $scope.step.name + '</span>',
                                type: 'button button-outline button-light'
                            }
                        ]
                    });

                    $scope.blurBackground = true;

                    alertPopup.then(function (res) {
                        var coursePage = $scope.step.name + '.html';
                        showModal(coursePage);
                        $scope.blurBackground = false;
                    });
                };

                var modalScope = $scope.$new();
                modalScope.slide = 0;
                $scope.hideModal = function () {
                    $scope.modal.hide();

                    console.log('complete congratulate: ' + profile.completeCongratulate);
                    console.log('complete courseCompleted: ' + profile.courseCompleted);
                    if (!profile.completeCongratulate && profile.courseCompleted) {

                        $scope.blurBackground = true;
                        var alertPopup = $ionicPopup.alert({
                            title: '',
                            cssClass: 'course-label-popup',
                            templateUrl: 'popupCourseCompleteTemplate.html'
                        });
                        alertPopup.then(function (res) {
                            $scope.blurBackground = false;
                            $scope.profile.completeCongratulate = true;
                            $scope.hideModal();
                            $scope.profile.$save();
                        });
                    }
                };

                modalScope.slideHasChanged = function (index) {
                    console.log('slide changed');
                    modalScope.slide = index;
                    if ((courseMetaData[profile.module - 1].length - 1) === index) {
                        modalScope.enableCompleteButton = true;
                        modalScope.animateCompleteButton = "animated pulse";
                    } else {
                        modalScope.enableCompleteButton = false;
                        modalScope.animateCompleteButton = "";
                    }
                    profile.updateCourseProgress(profile.module, (index + 1), false);
                };

                modalScope.completeModule = function () {

                    var slide = modalScope.slide;

                    var readyToClimb = true;
                    // if this is the last step
                    if (profile.module === courseMetaData.length && slide === 1) {
                        readyToClimb = false;
                        profile.courseCompleted = true;
                        var dt = new Date();
                        profile.courseCompletedDate = dt.getTime();
                        profile.$save();
                    }

                    if (courseMetaData[profile.module - 1].badgeComplete === true) {

                        $scope.badge = courseMetaData[profile.module - 1].badge;

                        var alertPopup = $ionicPopup.alert({
                            title: "",
                            templateUrl: 'popupBadgeCompleteTemplate.html',
                            cssClass: 'course-label-popup',
                            scope: $scope
                        });
                        $scope.blurBackground = true;
                        alertPopup.then(function (res) {
                            $scope.hideModal();
                            $scope.blurBackground = false;
                        });
                    } else {
                        $scope.hideModal();
                    }
                    profile.updateCourseProgress(profile.module, slide, readyToClimb);
                };

                function showModal(page) {

                    $ionicModal.fromTemplateUrl(page, {
                        scope: modalScope,
                        animation: 'slide-in-up',
                        backdropClickToClose: true
                    }).then(function (modal) {
                        $scope.modal = modal;
                        var numberOfSlides = courseMetaData[profile.module - 1].length;
                        console.log('numberOfSlides: ' + numberOfSlides);
                        if (numberOfSlides === 1) {
                            modalScope.enableCompleteButton = true;
                            modalScope.animateCompleteButton = "animated pulse";
                        } else {
                            modalScope.enableCompleteButton = false;
                            modalScope.animateCompleteButton = "";
                        }
                        modal.show();
                        profile.updateCourseProgress(profile.module, 1, profile.readyToClimb);
                    });

                    //Cleanup the modal when we're done with it!
                    $scope.$on('$destroy', function () {
                        $scope.modal.remove();
                    });
                    // Execute action on hide modal
                    $scope.$on('modal.hidden', function () {
                        // Execute action
                    });
                    // Execute action on remove modal
                    $scope.$on('modal.removed', function () {
                        // Execute action
                    });
                }

                var onCompleteClimb = function () {
                    updateStep($scope.step.pos);
                    $scope.boxyTweenComplete();
                };

                $scope.climb = function () {
                    if ($scope.step + 1 >= steps.length) {
                        return;
                    }
                    $scope.profile.readyToClimb = false;

                    var nextStep = steps[$scope.step.pos];
                    profile.updateCourseProgress(nextStep.pos, 0, false);

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
                    updateStep($scope.step.pos - 2);
                    $scope.boxyObj1.counter = $scope.step.frame;
                    tweenTo($scope.step.frame, 0, $scope.boxyTweenComplete, true);
                };

                var elem = document.getElementById('course-background');
                var tweenTo = function (frame, time, onComplete, paused) {

                    var TweenBoxy = TweenMax.to($scope.boxyObj1, time, {counter: frame, repeat: 0,
                        //ease:SteppedEase.config($scope.items.length), onComplete:boxyTweenComplete, paused:true, onUpdate:boxyTweenUpdate});
                        ease: SteppedEase.config(frame), onComplete: onComplete, paused: paused, onUpdate: boxyTweenUpdate});

                    function boxyTweenUpdate() {
                        if ($scope.boxyObj1.counter < imageOptions.items.length) {
                            //      console.log(boxyObj1.counter);
                            var pi = imageOptions.items[Math.ceil($scope.boxyObj1.counter)];
                            TweenMax.to(elem, 0, {
                                backgroundPosition: pi.bp,
                                top: pi.t,
                                left: pi.l,
                                width: pi.w,
                                height: pi.h
                            });
                        }
                    }

                    return TweenBoxy;
                };

                $scope.boxyTweenComplete = function () {
                    $scope.profile.showPlayButton = true;
                    $scope.profile.readyToClimb = false;
                    $scope.profile.$save();
                };

            }]);

}());
