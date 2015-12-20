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

       console.log($stateParams.answers);

        $scope.facebookSignup = function(){
            console.log($stateParams.answers);
            Util.facebookLogin($stateParams.answers);
        };
    }]);