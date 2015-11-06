/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.emailSignUp', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('emailSignUp', {
                url: '/emailSignUp',
                templateUrl: 'app/emailSignUp/emailSignUp.html',
                controller: 'EmailSignUpCtrl'
            })
    }])

    .controller('EmailSignUpCtrl', [ '$scope', '$state', function($scope, $state) {

        $scope.go = function(goTo){
            $state.go(goTo)
        }

    }]);