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
                controller: 'HomeCtrl'
            })
    }])

    .controller('HomeCtrl',
        [ '$scope', '$state', '$rootScope', 'Util', '$cordovaNetwork', 'AppService', function($scope, $state, $rootScope, Util, $cordovaNetwork, AppService) {

            document.addEventListener("deviceready", function () {

                var isOffline = $cordovaNetwork.isOffline()
                if (isOffline){
                    Util.showLoadingInternet();
                }

                // listen for Online event
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){

                    $rootScope.appService = AppService;
                    $rootScope.$apply();
                    var onlineState = networkState;
                    Util.hideLoading();
                });

                // listen for Offline event
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                    var offlineState = networkState;
                    //Util.showLoadingInternet();
                });

            }, false);


            $scope.go = function(goTo){
            try{
                $state.go(goTo);
            } catch(error){
                console.log(error.stack);
            }
        };
    }]);