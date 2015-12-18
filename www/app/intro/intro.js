/**
 * Created by alexmady on 18/12/15.
 */
'use strict';

angular.module('lifeUp.intro', [])

    .config( ['$stateProvider', function( $stateProvider ) {

        $stateProvider
            .state('intro', {
                url: '/intro',
                templateUrl: 'app/intro/intro.html',
                controller: 'IntroCtrl'
            });
    }])

    .controller('IntroCtrl',
        [ '$scope', '$state', '$ionicSlideBoxDelegate', function($scope, $state, $ionicSlideBoxDelegate) {

            $scope.nextSlide = function(){
                $ionicSlideBoxDelegate.next();
            };

            $scope.goToCreateAccount = function(){

                $state.go('createAccountChoice');

            };
    }]);