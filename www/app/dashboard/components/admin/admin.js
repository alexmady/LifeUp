/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.admin', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.admin', {
                url: "/admin",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/admin/admin.html",
                        controller: 'AdminCtrl'
                    }
                },
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth", function (Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }],
                    "profile": [ "UserProfile", "Auth", function (UserProfile, Auth) {
                        return UserProfile(Auth.$getAuth().uid).$loaded();
                    }]
                }
            })
    }])

    .controller('AdminCtrl', [ '$scope', 'profile', 'PromoCodes', function( $scope, profile, PromoCodes ) {

        $scope.isAdmin = profile.role === 'admin';

        $scope.addPromoCode = function(numberOfCodesToCreate, tag){

            console.log('generating ' + numberOfCodesToCreate + ' with tag ' + tag);

            try {
                var obj = PromoCodes;
                obj.$loaded()
                    .then(function(){

                        var codes = obj;
                        var dt = (new Date()).getTime();

                        var i = 0;

                        while (i < numberOfCodesToCreate){
                            var rid = Math.floor(Math.random()*Math.pow(36, 6));
                            var code = rid.toString(36);
                            if (codes[code]){
                                continue;
                            } else {
                                codes[code] = { used: false, tag: tag, dt: dt};
                                i++;
                            }
                        }
                        obj.$save();
                    });

            } catch( error ){
                console.log(error);
            }

        };

    }]);