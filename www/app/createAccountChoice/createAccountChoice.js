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

    .controller('CreateAccountChoiceCtrl', [ '$scope', '$state', '$ionicLoading', 'User',
        function($scope, $state, $ionicLoading, User) {

        $scope.go = function(goTo){
            $state.go(goTo)
        };

        $scope.facebookSignup = function(){

            User.facebookLogin();
        }

    }]);