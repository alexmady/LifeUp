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


        $scope.go = function( goTo ){
            $state.go( goTo )
        }

    }]);