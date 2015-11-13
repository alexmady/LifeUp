/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.createAccountEmail', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('createAccountEmail', {
                url: '/createAccountEmail',
                templateUrl: 'app/createAccountEmail/createAccountEmail.html',
                controller: 'CreateAccountEmailCtrl'
            })
    }])

    .controller('CreateAccountEmailCtrl', [ '$scope', '$rootScope', '$state', 'FIREBASE_URL', function($scope, $rootScope, $state, FIREBASE_URL) {

        $scope.go = function(goTo){
            $state.go(goTo)
        }

        $scope.goBack = function(){
            $scope.go($rootScope.previousState.name);
        }

        $scope.createAccount = function(user){

          var ref = new Firebase(FIREBASE_URL);

            ref.createUser({
                email    : user.email,
                password : user.pass
            }, function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);

                    console.log('Creating user profile');




                    $state.go('emailSignIn');
                }
            });

        };
    }]);