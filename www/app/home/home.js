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
        [ '$scope', '$state', 'appService', 'Util', '$rootScope',
            function( $scope, $state, appService, Util, $rootScope ) {

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

                        /*console.log('got the image opts');
                        $scope.spritePNGFile = imgOpts.spritePNGFile;
                        console.log('before mountain file');
                        $rootScope.mountainFile = imgOpts.mountainFile;
                        console.log('items');
                        $scope.item = imgOpts.items[0];
                        $scope.bgSizeW = imgOpts.bgSizeW;
                        $scope.bgSizeH = imgOpts.bgSizeH;*/

                        /*console.log($scope.spritePNGFile);

                        var image1 = new Image();
                        var image2 = new Image();

                        image1.onload = function(){
                           console.log('image1 loaded');
                        };
                        image2.onload = function(){
                            console.log('image2 loaded');
                        };

                        image1.src = imgOpts.spritePNGFile;
                        image2.src = imgOpts.mountainFile;*/



                        console.log('about to hide loading');

                        Util.hideLoading();
                    }).catch(function(error){
                        console.log('there was an error');
                        console.log(error.message);
                        console.log(error.stack);
                        console.log(error);
                    });

            }]);
}());
