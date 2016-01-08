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

            try {
                if (!Util.isOnline()){
                    Util.popup('No Internet Connection', 'No internet connection. Please try again when you have an internet connection.', null, $scope);
                    return;
                }
            } catch (error){ }

            Util.showLoading();

            Util.facebookLogin($stateParams.answers, $scope)
                .then(function(){
                    console.log('logged in with facebook');
                    Util.hideLoading();
                }).catch(function(error){
                    Util.hideLoading();
                    Util.popup('', error, null, $scope);
                });
        };
    }]);