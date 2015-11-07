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

    .controller('SignInChoiceCtrl', [ '$state', '$scope', 'Auth', function($state, $scope, Auth) {

        $scope.go = function( goTo ){
            $state.go( goTo )
        }

        $scope.facebookLogin = function() {

            Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
                // User successfully logged in
            }).catch(function(error) {
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                    Auth.$authWithOAuthPopup("facebook").then(function(authData) {
                        // User successfully logged in. We can log to the console
                        // since we’re using a popup here
                        console.log(authData);
                    });
                } else {
                    // Another error occurred
                    console.log(error);
                }
            });
        };

    }]);