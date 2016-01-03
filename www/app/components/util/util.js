/**
 * Created by alexmady on 10/12/15.
 */

angular.module('lifeUp.util', ['ionic'])

    .factory('Util', ['$ionicLoading', '$cordovaFacebook', 'Auth', 'UserProfile', '$state', '$ionicPopup', '$cordovaNetwork', '$window', '$http',

        function($ionicLoading, $cordovaFacebook, Auth, UserProfile, $state, $ionicPopup, $cordovaNetwork, $window, $http) {

            var showLoading = function(){
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });
            };

            var hideLoading = function() {
                $ionicLoading.hide();
            };

            var popup = function(title, msg, goTo, $scope){

                $scope.blurBackground = true;
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: '<p class="lifeup-earnt-badge center" style="text-align: center">'+msg+'</p>',
                    cssClass: 'course-label-popup',
                    buttons: [
                        {
                            text: 'OK',
                            type: 'button button-outline button-light'
                        }
                    ]
                });
                alertPopup.then(function (res) {
                    $scope.blurBackground = false;
                    if (goTo !== null && goTo !== undefined) {
                        $state.go(goTo);
                    }
                });
            };


            var isOnline  = function(){
                var online = $cordovaNetwork.isOnline();
                return online;
            };

            function processImages(spriteDataFileName, spritePNGFile, scaleW, scaleH){

                return $http.get(spriteDataFileName)
                    .then(function (resp) {

                        var data = resp.data;
                        var items = [];
                        var spriteMeta = data.meta;

                        $.each(data, function (key, val) {
                            $.each(data[key], function (k, v) {
                                if (v.frame) {
                                    var posInfo = {};
                                    posInfo.bp = '-' + v.frame.x / scaleW + 'px -' + v.frame.y / scaleH + 'px';
                                    posInfo.w = v.frame.w / scaleW + 'px';
                                    posInfo.h = v.frame.h / scaleH + 'px';
                                    posInfo.t = v.spriteSourceSize.y / scaleH + 'px';
                                    posInfo.l = v.spriteSourceSize.x / scaleW + 'px';
                                    items.push(posInfo);
                                    //console.log(posInfo);
                                }
                            });
                        });

                        var bgSizeW = spriteMeta.size.w / scaleW  + 'px';
                        var bgSizeH = spriteMeta.size.h / scaleH  + 'px';

                        return {
                            bgSizeW: bgSizeW,
                            bgSizeH: bgSizeH,
                            items: items,
                            spritePNGFile: spritePNGFile
                        };
                    }).catch(function(error){

                        console.error('could not GET the sprites.');

                    });
            };


            var imgOptions = null;

            // returns a promise thta is resolved once the json file has been loaded
            var imageOptions = function(){

                if (imgOptions === null) {

                    //var screenWidth = $window.screen.width;
                    //var screenHeight = $window.screen.height;
                    var screenWidth = $window.innerWidth;
                    var screenHeight = $window.innerHeight;

                    console.log('sw '+ screenWidth + ' sh ' + screenHeight);

                    var devicePixelRatio = $window.devicePixelRatio;

                    var spritePNGFile = 'img/sprite-' + screenWidth + 'x' + screenHeight + '.png';
                    var spriteDataFileName = 'img/sprite-' + screenWidth + 'x' + screenHeight + '.json';

                    if (devicePixelRatio > 1) {
                        var w = screenWidth * devicePixelRatio;
                        var h = screenHeight * devicePixelRatio;
                        spritePNGFile = 'img/sprite-' + w + 'x' + h + '.png';
                        spriteDataFileName = 'img/sprite-' + w + 'x' + h + '.json';
                    }

                    // check if file exists, if not default it
                    return $http.get(spriteDataFileName)
                        .then(function(){

                            console.log('not scaling.....');
                            return processImages(spriteDataFileName, spritePNGFile, devicePixelRatio, devicePixelRatio);

                        }).catch(function(error){

                            console.log('scaling....');
                            // TODO: choose most appropriate size to scale

                            w = 1125;
                            h = 2001;

                            spritePNGFile = 'img/sprite-' + w + 'x' + h + '.png';
                            spriteDataFileName = 'img/sprite-' + w + 'x' + h + '.json';

                            var scaleFactorW = w / screenWidth ;
                            var scaleFactorH = h / screenHeight ;

                            console.log(scaleFactorH + ' x ' + scaleFactorW);

                            return processImages(spriteDataFileName, spritePNGFile, scaleFactorW, scaleFactorH);

                        }).finally(function(){

                            console.log(" deviceW: " + screenWidth + " deviceH: " + screenHeight +
                                    " devicePixelRatio: " + devicePixelRatio + " sprite: " + spritePNGFile  +
                                    " data: " + spriteDataFileName);
                        });

                } else {
                    return imgOptions;
                }
            };


            var facebookLogin = function(goalsQuestionsAnswers) {

                showLoading();

                var options = {
                    remember: "default",
                    scope: "email"
                };

                if(ionic.Platform.isWebView()){

                    $cordovaFacebook.login(["public_profile", "email"]).then(function(success){

                        Auth.$authWithOAuthToken("facebook", success.authResponse.accessToken). then( function( authData) {

                            try {

                                UserProfile(authData.uid).$loaded()
                                    .then(function(profile){
                                        if (!profile.exists()){
                                            profile.create(authData.facebook.email, goalsQuestionsAnswers);
                                        }
                                        $state.go('dashboard.dashboardHome');
                                        hideLoading();
                                    });


                            } catch (error){
                                hideLoading();
                                console.log(error.message);
                                console.error(error);
                            }

                        }).catch(function(error){
                            hideLoading();
                            console.log('Firebase login failed!', error);
                        });

                    }, function(error){
                        hideLoading();
                        console.log(error);
                    });

                }
                else {

                    Auth.$authWithOAuthPopup("facebook", options).then(function (authData) {
                        // User successfully logged in. We can log to the console
                        // since we’re using a popup here
                        try {

                            UserProfile(authData.uid).$loaded()
                                .then(function(profile){
                                    if (!profile.exists()){
                                        profile.create(authData.facebook.email, goalsQuestionsAnswers);
                                    }
                                    $state.go('dashboard.dashboardHome');
                                    hideLoading();
                                }).catch(function(error){
                                    console.log(error);
                                    hideLoading();
                                });

                        } catch (error){
                            hideLoading();
                            console.log(error.message);
                            console.error(error);
                        }
                    });
                }

            };

            return {
                showLoading: showLoading,
                hideLoading: hideLoading,
                facebookLogin: facebookLogin,
                popup: popup,
                isOnline: isOnline,
                imageOptions: imageOptions
            };
        }
    ]);