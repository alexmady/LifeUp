/**
 * Created by alexmady on 04/12/15.
 */
'use strict';

angular.module('lifeUp.dashboardHome', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.dashboardHome', {
                cache:false,
                url: "/dashboardHome",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/home/dashboardHome.html",
                        controller: 'DashHomeCtrl'
                    }
                },
                resolve: {
                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth", function (Auth) {
                        // $waitForAuth returns a promise so the resolve waits for it to complete
                        return Auth.$waitForAuth();
                    }],

                    "profile": [ "UserProfile", "Auth", function (UserProfile, Auth) {
                        return UserProfile(Auth.$getAuth().uid).$loaded();
                    }]
                }
            })
    }])

    .controller('DashHomeCtrl', [ '$scope', 'currentAuth', 'profile', '$state', function($scope, currentAuth, profile, $state) {

        $scope.go = function(){
            $state.go('dashboard.course');
        };

        var init = function(){

                console.log(profile);

                if (profile.firstLogin === true){
                    console.log('saving...');
                    $scope.title = 'Meet Mike....';
                    $scope.firstLogin = true;
                    profile.firstLogin = false;
                    console.log('saving...');
                    profile.$save();

                } else {
                    $scope.title = 'Welcome Back!';
                    $scope.firstLogin = false;
                }

        };

        init();

    }]);