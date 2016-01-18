(function () {
    'use strict';

    angular.module('lifeUp.dashboardHome', [ ])

        .config( ['$stateProvider', function($stateProvider) {

            $stateProvider
                .state('dashboard.dashboardHome', {
                    cache:false,
                    url: "/dashboardHome",
                    views: {
                        'dashboardContent': {
                            templateUrl: "dashboardHome.html",
                            controller: 'DashHomeCtrl'
                        }
                    },
                    resolve: {
                        // controller will not be loaded until $waitForAuth resolves
                        // Auth refers to our $firebaseAuth wrapper in the example above
                        "currentAuth": ["Auth", function (Auth) {
                            // $waitForAuth returns a promise so the resolve waits for it to complete
                            return Auth.$requireAuth();
                        }],

                        "profile": [ "UserProfile", "Auth", function (userProfile, Auth) {
                            return userProfile(Auth.$getAuth().uid).$loaded();
                        }]
                    }
                });
        }])

        .controller('DashHomeCtrl', [ '$scope', 'currentAuth', 'profile', '$state', function($scope, currentAuth, profile, $state) {

            $scope.go = function(){
                $state.go('dashboard.course');
            };

            var init = function(){
                if (profile.firstLogin === true){
                    $scope.title = 'Ready?';
                    $scope.firstLogin = true;
                    profile.firstLogin = false;
                    profile.$save();

                } else {
                    $scope.title = 'Welcome Back!';
                    $scope.firstLogin = false;
                }
            };

            init();

        }]);
}());
