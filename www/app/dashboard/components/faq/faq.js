/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.faq', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.faq', {
                url: "/faq",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/faq/faq.html",
                        controller: 'FaqCtrl'
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

    .controller('FaqCtrl', [ '$scope', function($scope) {


    }]);