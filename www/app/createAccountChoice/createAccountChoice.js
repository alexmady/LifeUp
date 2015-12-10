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
                resolve: {
                    "currentAuth": ["Auth", function (Auth) {
                        return Auth.$waitForAuth();
                    }]
                }
            })
    }])

    .controller('CreateAccountChoiceCtrl', [ '$scope', '$state', '$ionicPopup', 'Auth', 'UserProfile', 'Util',
        function($scope, $state, $ionicPopup, Auth, UserProfile, Util) {

        $scope.go = function(goTo){
            $state.go(goTo)
        };

        $scope.facebookSignup = function(){

            Util.facebookLogin();
        };
    }]);