/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.how', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.how', {
                url: "/how",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/how/how.html",
                        controller: 'HowCtrl'
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
            })
    }])

    .controller('HowCtrl', [ '$scope', function($scope) {


    }]);