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
                controller: 'CreateAccountChoiceCtrl',
                params: {
                    answers: null
                }
            })
    }])

    .controller('CreateAccountChoiceCtrl', [ '$scope', '$state', '$ionicPopup', 'Auth', 'UserProfile', 'Util', '$stateParams',
        function($scope, $state, $ionicPopup, Auth, UserProfile, Util, $stateParams) {

        $scope.go = function(goTo){
            $state.go(goTo, {answers: $stateParams.answers});
        };

        $scope.facebookSignup = function(){

            if (!Util.isOnline()){
                Util.popup('No Internet Connection', 'Please try again when you have a connection.', null, $scope);
                return;
            }

            Util.facebookLogin($stateParams.answers);
        };
    }]);