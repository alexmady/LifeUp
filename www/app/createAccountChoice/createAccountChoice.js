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

    .controller('CreateAccountChoiceCtrl', [ '$scope', '$state', 'Auth', '$ionicLoading',
        function($scope, $state, Auth, $ionicLoading) {

        $scope.go = function(goTo){
            $state.go(goTo)
        };

        $scope.facebookSignup = function(){

            $ionicLoading.show({
                template: 'Creating account...'
            });
            Auth.facebookLogin();
        }

    }]);