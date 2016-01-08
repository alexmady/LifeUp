/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.audio', [ ])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('dashboard.audio', {
                url: "/audio",
                cache: false,
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/audio/audio.html",
                        controller: 'AudioCtrl'
                    }
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

    .controller('AudioCtrl', [ '$scope', 'Util', '$state',
        function ($scope, Util, $state ) {

            $scope.audios = [
                { name: 'DISARM', src: 'audio/disarm.mp3'},
                { name: 'SPACE BREAK (4 mins)', src:'audio/space_break_4_mins.mp3'},
                { name: 'SPACE BREAK (9 mins)',src: 'audio/space_break_9_mins.mp3'},
                { name: 'FLOW',src: 'audio/flow.mp3'},
                { name: 'ATTENTION TRAINING (with intro)',src: 'audio/attention_training_intro.mp3'},
                { name: 'ATTENTION TRAINING (no intro)',src: 'audio/attention_training_no_intro.mp3'},
                { name: 'THOUGHT BREAK - 10 Breaths (with intro)', src: 'audio/thought_break_10_intro.mp3'},
                { name: 'THOUGHT BREAK - 10 Breaths (no intro)', src: 'audio/thought_break_10_no_intro.mp3'}
            ];

            $scope.open = function(audio){
                $state.go('dashboard.audioPlayer', {audio:audio });
            };

        }]);