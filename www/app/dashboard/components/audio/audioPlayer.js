(function () {
    'use strict';

    angular.module('lifeUp.audioPlayer', [ ])

        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider
                .state('dashboard.audioPlayer', {
                    url: "/audioPlayer",
                    views: {
                        'dashboardContent': {
                            templateUrl: "audioPlayer.html",
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
                        }],
                        "profile": [ "UserProfile", "Auth", function (userProfile, Auth) {
                            return userProfile(Auth.$getAuth().uid).$loaded();
                        }]
                    }
                });
        }])

        .controller('AudioPlayerCtrl', [ '$scope', 'Util', '$stateParams', '$state', 'profile',
            function ( $scope, Util, $stateParams, $state, profile ) {

                $scope.go = function () {
                    $scope.pause();
                    $state.go('dashboard.audio');
                };

                $scope.audio = $stateParams.audio;
                $scope.audio.obj = new Audio();

                $scope.audio.obj.addEventListener('ended', function(){
                    console.log($scope.audio.src + ' - ended');
                    profile.updateAudioProgress($scope.audio.src, 'Ended');
                });

                $scope.audio.obj.addEventListener('loadedmetadata', function() {
                    $scope.audio.obj.play();
                    $scope.audio.obj.pause();
                    console.log('loadedmetadata event fired');
                    console.log('setting audio duration to :' + $scope.audio.obj.duration);
                    var formatted = Util.timeFormatter($scope.audio.obj.duration);
                    console.log('formatted audio duration: ' + formatted);
                    $scope.audio.duration = formatted;
                    $scope.$apply();
                });

                $scope.audio.obj.addEventListener('durationchange', function(e) {
                    console.log('durationchange event fired');
                    var duration = $scope.audio.obj.duration;
                    console.log(duration);
                    var formatted = Util.timeFormatter(duration);
                    $scope.audio.duration = formatted;
                    $scope.$apply();
                    console.log('from target: ' + e.target.duration);
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


                $scope.play = function () {
                    profile.updateAudioProgress($scope.audio.src, 'Play');
                    $scope.audio.obj.play();
                };

                $scope.pause = function () {
                    profile.updateAudioProgress($scope.audio.src, 'Pause');
                    $scope.audio.obj.pause();
                };

            }]);

}());
