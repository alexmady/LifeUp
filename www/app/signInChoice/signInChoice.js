/**
 * Created by alexmady on 05/11/15.
 */
'use strict';

angular.module('lifeUp.signInChoice', [])

    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('signInChoice', {
                url: '/signInChoice',
                templateUrl: 'app/signInChoice/signInChoice.html',
                controller: 'SignInChoiceCtrl'
            })

    }])

    .controller('SignInChoiceCtrl', [ '$state', '$scope', function($state, $scope) {


        $scope.goToIntro = function(){
            $state.go('home')
        }

        $scope.termsAndConditionsClick = function(){
            $state.go('termsAndConditions')
        }

        $scope.privacyPolicyClick = function(){
            $state.go('privacyPolicy')
        }

    }]);