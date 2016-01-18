(function () {
    'use strict';

    angular.module('lifeUp.about', [])

        .config( ['$stateProvider', function($stateProvider) {

            $stateProvider
                .state('dashboard.about', {
                    url: "/about",
                    views: {
                        'dashboardContent': {
                            templateUrl: "about.html",
                            controller: 'AboutCtrl'
                        }
                    },
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        // Auth refers to our $firebaseAuth wrapper in the example above
                        "currentAuth": ["Auth", function (Auth) {
                            // $requireAuth returns a promise so the resolve waits for it to complete
                            // If the promise is rejected, it will throw a $stateChangeError (see above)
                            return Auth.$requireAuth();
                        }]
                    }
                });
        }])

        .controller('AboutCtrl', [ '$scope', function($scope) {


        }]);}());
