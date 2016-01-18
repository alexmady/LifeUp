(function () {
    'use strict';

    angular.module('lifeUp.intro', [])

        .config( ['$stateProvider', function( $stateProvider ) {

            $stateProvider
                .state('intro', {
                    cache: false,
                    url: '/intro',
                    templateUrl: 'intro.html',
                    controller: 'IntroCtrl'
                });
        }])

        .controller('IntroCtrl',
        [ '$scope', '$state', '$ionicSlideBoxDelegate', 'goalQuestions', function($scope, $state, $ionicSlideBoxDelegate, goalQuestions) {


            $scope.disableSwipe = function() {
                $ionicSlideBoxDelegate.enableSlide(false);
            };

            $scope.goalQuestions = goalQuestions;

            var answers = {};

            function addAnswer(ans){
                var n = $ionicSlideBoxDelegate.currentIndex()+1;
                answers['answer'+n] = ans;
            }

            $scope.nextSlide = function(answer){
                addAnswer(answer);
                $ionicSlideBoxDelegate.next();
            };

            $scope.goToCreateAccount = function(answer){
                addAnswer(answer);
                $state.go('createAccountChoice', {answers: answers});
            };
        }]);

}());
