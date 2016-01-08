/**
 * Created by alexmady on 07/01/16.
 */
/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.audioPlayer', [ ])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('dashboard.audioPlayer', {
                url: "/audioPlayer",
                cache: false,
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/audio/audioPlayer.html",
                        controller: 'AudioPlayerCtrl'
                    }
                },
                params: {
                    audio: null
                },
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth", function (Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }]
                }
            })
    }])

    .controller('AudioPlayerCtrl', [ '$scope', 'Util', '$stateParams', '$state', function ( $scope, Util, $stateParams, $state ) {

            $scope.go = function () {
                $scope.pause();
                $state.go('dashboard.audio');
            };

            //console.log('$stateParams.audio');
            //console.log($stateParams.audio);

            $scope.audio = $stateParams.audio;
            $scope.audio.obj = new Audio();

            $scope.audio.obj.addEventListener('loadedmetadata', function() {
                $scope.audio.duration = Util.timeFormatter($scope.audio.obj.duration);
                $scope.$apply();
            });

            $scope.audio.obj.src = $stateParams.audio.src;

            $scope.audio.obj.ontimeupdate = function(){
                $scope.audio.seekValue = this.currentTime / this.duration * 100;
                $scope.audio.time = Util.timeFormatter(this.currentTime);
                $scope.$apply();
            };

            $scope.audio.seekValue = 0;
            $scope.audio.time = '0:00';

            $scope.audio.obj.slider = {
                value: 0,
                hideLimitLabels: true,
                options: {
                    floor: 0,
                    ceil: 100,
                    translate: function(){
                        return '';
                    },
                    onChange: function(){
                        $scope.audio.obj.currentTime = $scope.audio.seekValue / 100 * $scope.audio.obj.duration;
                    }
                }
            };

        /*for (var i = 0;i< $scope.audios.length;i++){

            (function(){




                var audioObj = { audio: audio, seekValue: 0, time: '0:00'};

                audio.ontimeupdate = function(){
                    audioObj.seekValue = this.currentTime / this.duration * 100;
                    audioObj.time = Util.timeFormatter(this.currentTime);
                    $scope.$apply();
                };

                audioObj.slider = {
                    value: 0,
                    hideLimitLabels: true,
                    options: {
                        floor: 0,
                        ceil: 100,
                        translate: function(){
                            return '';
                        },
                        onChange: function(){
                            audio.currentTime = audioObj.seekValue / 100 * audioObj.audio.duration;
                        }
                    }
                };

                $scope.audioDic[$scope.audios[i].src] = audioObj;
            })();
        }*/

            $scope.play = function () {
                $scope.audio.obj.play();
            };

            $scope.pause = function () {
                $scope.audio.obj.pause();
            };

        }]);