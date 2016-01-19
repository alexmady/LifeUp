
(function () {

    'use strict';

    angular.module('lifeUp.home', [])

        .config( ['$stateProvider', function($stateProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'home.html',
                    controller: 'HomeCtrl',
                    resolve: {

                        "appService": ["AppService", function (AppService) {

                            return AppService.$loaded();
                        }]
                    }
                });
        }])

        .controller('HomeCtrl',
        [ '$scope', '$state', 'appService', 'Util',
            function( $scope, $state, appService, Util ) {


                $scope.appService = appService;

                appService.$watch(function(){

                    console.log('app service watch');

                    if (appService && appService.enableApp === false){
                        $state.go('home');
                    }
                });

                $scope.go = function(goTo){
                    try{
                        $state.go(goTo);
                    } catch(error){
                        console.log(error.stack);
                    }
                };

                Util.imageOptions()
                    .then(function(imgOpts){
                        $scope.spritePNGFile = imgOpts.spritePNGFile;
                        $scope.item = imgOpts.items[0];
                        console.log($scope.spritePNGFile);
                        $scope.bgSizeW = imgOpts.bgSizeW;
                        $scope.bgSizeH = imgOpts.bgSizeH;
                        Util.hideLoading();
                    });

            }]);
}());
