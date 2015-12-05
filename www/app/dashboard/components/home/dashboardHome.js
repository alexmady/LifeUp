/**
 * Created by alexmady on 04/12/15.
 */
'use strict';

angular.module('lifeUp.dashboardHome', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.dashboardHome', {
                cache: false,
                url: "/faq",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/home/dashboardHome.html",
                        controller: 'DashHomeCtrl'
                    }
                }
            })
    }])

    .controller('DashHomeCtrl', [ '$scope', 'User', function($scope, User) {

        User.getProfile().then(function(profile){

            console.log('got profile...:');
            //console.log(profile);

            $scope.firstLogin = profile.firstLogin;

            if (profile.firstLogin === true){
                profile.firstLogin = false;
                profile.$save();
                $scope.title = 'Meet Mike....';

            } else {
                $scope.title = 'Welcome Back!';
            }

        });

    }]);