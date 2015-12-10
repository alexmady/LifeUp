/**
 * Created by alexmady on 05/11/15.
 */
'use strict';

angular.module('lifeUp.home', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/home/home.html',
                controller: 'HomeCtrl',
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth", function (Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$waitForAuth();
                    }]
                }

            })
    }])

    .controller('HomeCtrl',
        [ '$scope', '$state', function($scope, $state) {

            $scope.go = function(goTo){
            try{
                $state.go(goTo);
            } catch(error){
                console.log(error.stack);
            }
        };
    }]);