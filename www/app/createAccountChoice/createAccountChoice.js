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

            Util.showLoading();

            var options = {
                remember: "default",
                scope: "email"
            };

            Auth.$authWithOAuthRedirect("facebook", options).then(function (authData) {

                //$state.go('dashboard.dashboardHome');
                console.log('fbook auth');
                try {

                    var up = UserProfile(authData.uid);
                    console.log(up);


                } catch ( error ){


                    console.error(error);
                }

            }).catch(function (error) {

                console.error(error);

                if (error.code === "TRANSPORT_UNAVAILABLE") {
                    Auth.$authWithOAuthPopup("facebook", options).then(function (authData) {
                        // User successfully logged in. We can log to the console
                        // since we’re using a popup here
                        console.log('fbook auth 2');
                    });
                } else {
                    Util.hideLoading();
                    // Another error occurred
                    console.error(error.stack);
                }
            });
        };


    }]);