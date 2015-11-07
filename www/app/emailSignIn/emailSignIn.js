/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.emailSignIn', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('emailSignIn', {
                url: '/emailSignIn',
                templateUrl: 'app/emailSignIn/emailSignIn.html',
                controller: 'EmailSignInCtrl'
            })
    }])

    .controller('EmailSignInCtrl', [ '$scope', '$rootScope', '$state', 'Auth', function($scope, $rootScope, $state, Auth) {

        $scope.go = function(goTo){
            $state.go(goTo)
        }

        $scope.goBack = function(){
            $scope.go($rootScope.previousState.name);
        }

        $scope.login = function(user){

            console.log(user);

            Auth.$authWithPassword({
                email    : user.email,
                password : user.pass
            }).catch(function(error){
                console.log(error);
            }).then(function(data){
                console.log(data);

            });
        }

    }]);