/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.createAccount', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('createAccountChoice', {
                url: '/createAccountChoice',
                templateUrl: 'app/createAccountChoice/createAccountChoice.html',
                controller: 'CreateAccountChoiceCtrl'
            })
    }])

    .controller('CreateAccountChoiceCtrl', [ '$scope', '$rootScope', '$state', 'FIREBASE_URL', function($scope, $rootScope, $state, FIREBASE_URL) {

        $scope.go = function(goTo){
            $state.go(goTo)
        }

        $scope.goBack = function(){
            $scope.go($rootScope.previousState.name);
        }

    }]);