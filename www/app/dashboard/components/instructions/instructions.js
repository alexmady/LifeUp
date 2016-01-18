(function () {
    'use strict';

    angular.module('lifeUp.instructions', [ ])

        .config( ['$stateProvider', function($stateProvider) {

            $stateProvider
                .state('dashboard.instructions', {
                    url: "/instructions",
                    views: {
                        'dashboardContent': {
                            templateUrl: "instructions.html",
                            controller: 'InstructionsCtrl'
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

        .controller('InstructionsCtrl', [ '$scope', function($scope) {


        }]);
}());
