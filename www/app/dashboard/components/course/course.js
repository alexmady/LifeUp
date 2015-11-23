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

    .controller('CourseCtrl', [ '$scope', '$state', '$window',
        function ($scope, $state, $window) {

        console.log('CourseController.......');

        $scope.go = function (goTo) {
            $state.go(goTo);
        };

        $scope.debug = function(){
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

        $scope.play = function (){
            console.log('play');
            TweenBoxy.play();
        };

        $scope.pause = function (){
            console.log('pause');
            TweenBoxy.pause();
        };

        $scope.restart = function (){
            console.log('restarting');
            TweenBoxy.restart();
        };


        $scope.devicePixelRatio = $window.devicePixelRatio;
        $scope.spritePNGFile = '../img/sprite-' + $window.innerWidth + 'x' + $window.innerHeight + '.png';
        $scope.spriteDataFileName = '../img/sprite-' + $window.innerWidth + 'x' + $window.innerHeight + '.json';

        if ($scope.devicePixelRatio === 2){
            var w2 = ($window.innerWidth * 2);
            var h2 = ($window.innerHeight * 2);
            $scope.spritePNGFile = '../img/sprite-' +  w2 + 'x' + h2 + '.png';
            $scope.spriteDataFileName = '../img/sprite-' + w2 + 'x' + h2 + '.json';
        }

        $.ajaxSetup({async: false});
        // Your $.getJSON() request is now synchronous...

        $scope.items = [];
        $.getJSON( $scope.spriteDataFileName, function( data ) {

            $scope.spriteMeta = data.meta;

            $.each( data, function( key, val ) {
                $.each(data[key], function(k,v){
                    if (v.frame){
                        var posInfo = {};
                        var scale = $scope.devicePixelRatio;
                        posInfo.bp = '-' + v.frame.x/scale + 'px -' + v.frame.y/scale + 'px';
                        posInfo.w = v.frame.w/scale + 'px';
                        posInfo.h = v.frame.h/scale + 'px';
                        posInfo.t = v.spriteSourceSize.y/scale + 'px';
                        posInfo.l = v.spriteSourceSize.x/scale + 'px';
                        $scope.items.push(posInfo);
                        //console.log(posInfo);
                    }
                });
            });
        });

        $.ajaxSetup({async: true});

        $scope.bgSizeW = $scope.spriteMeta.size.w / 2 + 'px';
        $scope.bgSizeH = $scope.spriteMeta.size.h / 2 + 'px';



            /*


                    var perRowMap = {};
                    perRowMap['320x480'] = 7;
                    perRowMap['375x667'] = 5;


                    var boxyArray1 = [];

                    var noImages = 115;
                    var deviceWidth = $window.innerWidth;
                    var deviceHeight = $window.innerHeight;
                    var imagesPerRow = 7;

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
                    //console.log(boxyArray1.length);
            */
        var boxyObj1 = { counter: 0};
        var TweenBoxy = TweenMax.to(boxyObj1, 4.2, {counter:$scope.items.length, repeat:0,
            ease:SteppedEase.config($scope.items.length), onComplete:boxyTweenComplete, paused:true, onUpdate:boxyTweenUpdate});

        function boxyTweenUpdate(){
            if (boxyObj1.counter < $scope.items.length){
                //console.log(boxyObj1.counter);
                var pi = $scope.items[Math.ceil(boxyObj1.counter)];
                TweenMax.to('.course-background', 0, {
                    backgroundPosition: pi.bp,
                    top: pi.t,
                    left: pi.l,
                    width: pi.w,
                    height: pi.h
                });

                // For later

                //if (boxyObj1.counter > 75){
                //    TweenBoxy.pause();
                //}

            }


        }

        function boxyTweenComplete(){
            console.log('complete');
            //console.log(boxyArray1[boxyArray1.length-1]);
          //  TweenMax.to('.course-background', {backgroundPosition:'-2248px -4669px', immediateRender:true});
        }

      //    TweenBoxy.play();





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