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
                }
            })
    }])

    .controller('DashHomeCtrl', [ '$scope', 'User', '$state', '$ionicLoading', function($scope, User, $state,  $ionicLoading) {

        $scope.go = function(){
            $state.go('dashboard.course');
        };

        $scope.ready = false;

        var init = function(){

            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner>'
            });

            var promise = User.getProfile();

            promise.then(function(profile){

                $scope.firstLogin = profile.firstLogin;

                if (profile.firstLogin === true){
                    $scope.title = 'Meet Mike....';
                    profile.firstLogin = false;
                    $scope.ready = true;
                    $ionicLoading.hide();
                    profile.$save();

                } else {
                    $scope.title = 'Welcome Back!';
                    $ionicLoading.hide();
                    $scope.ready = true;
                }


            });
        };

        init();

    }]);