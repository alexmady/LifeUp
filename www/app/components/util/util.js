/**
 * Created by alexmady on 10/12/15.
 */

angular.module('lifeUp.util', ['ionic'])

    .factory('Util', [

        '$ionicLoading',
        '$cordovaFacebook',
        'Auth',
        'UserProfile',
        '$state',
        '$ionicPopup',
        '$cordovaNetwork',
        '$window',
        '$http',

        function (

            $ionicLoading,
            $cordovaFacebook,
            Auth,
            UserProfile,
            $state,
            $ionicPopup,
            $cordovaNetwork,
            $window,
            $http   ) {

            var showLoading = function () {
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });
            };

            var showLoadingInternet = function () {
                $ionicLoading.show({
                    templateUrl: 'app/components/util/internetLoadingTemplate.html'
                });
            };

            var hideLoading = function () {
                $ionicLoading.hide();
            };

            var popup = function (title, msg, goTo, $scope, thenFn) {

                $scope.blurBackground = true;

                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: '<p class="lifeup-earnt-badge center" style="text-align: center">' + msg + '</p>',
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

            var logout = function(profile){

                if (!profile){
                    throw new Error('Can not log out because profile arg not supplied');
                } else {
                    profile.clear();
                    Auth.$unauth();
                    $state.go('home');
                }
            };

            var isOnline = function () {
                var online = $cordovaNetwork.isOnline();
                return online;
            };

            function successFunction() { }
            function errorFunction(error) { }

            function makeAndroidFullscreen() {
                if (ionic.Platform.isAndroid()) {
                    try {
                        // Hide system UI and keep it hidden (Android 4.4+ only)
                        AndroidFullScreen.immersiveMode(successFunction, errorFunction);
                    } catch (error) {}
                }
            }

            function processImages(spriteDataFileName, spritePNGFile, adjustment) {

                return $http.get(spriteDataFileName)
                    .then(function (resp) {

                        var data = resp.data;
                        var items = [];
                        var spriteMeta = data.meta;
                        var scale = adjustment.scaleFactor;
                        var wAdjust = 0;
                        var hAdjust = 0;

                        if (adjustment.type) {
                            if (adjustment.type === 'height') {
                                hAdjust = adjustment.size;
                            } else if (adjustment.type === 'width') {
                                wAdjust = adjustment.size;
                            }
                        }

                        $.each(data, function (key, val) {
                            $.each(data[key], function (k, v) {
                                if (v.frame) {
                                    var posInfo = {};
                                    posInfo.bp = '-' + v.frame.x * scale + 'px -' + v.frame.y * scale + 'px';
                                    posInfo.w = v.frame.w * scale + 'px';
                                    posInfo.h = v.frame.h * scale + 'px';
                                    posInfo.t = ((v.spriteSourceSize.y * scale ) - hAdjust) + 'px';
                                    posInfo.l = ((v.spriteSourceSize.x * scale ) - wAdjust) + 'px';
                                    items.push(posInfo);
                                }
                            });
                        });

                        var bgSizeW = spriteMeta.size.w * scale + 'px';
                        var bgSizeH = spriteMeta.size.h * scale + 'px';

                        return {
                            bgSizeW: bgSizeW,
                            bgSizeH: bgSizeH,
                            items: items,
                            spritePNGFile: spritePNGFile
                        };
                    }).catch(function (error) {

                        console.error('could not GET the sprites.');

                    });
            }

            var imgOptions = null;

            // returns a promise that is resolved once the json file has been loaded
            var imageOptions = function () {

                if (imgOptions === null) {

                    var screenWidth = $window.screen.width;
                    var screenHeight = $window.screen.height;
                    var innerWidth = $window.innerWidth;
                    var innerHeight = $window.innerHeight;

                    // UPDATE: now setting immersive moce so no menu is present.
                    // inner height is less on android when part of the screen is being used as
                    // the buttons area.
                    //screenWidth = innerWidth;
                    //screenHeight = innerHeight;

                    var devicePixelRatio = $window.devicePixelRatio;


                    var spritePNGFile = 'img/sprite-' + screenWidth + 'x' + screenHeight + '.png';
                    var spriteDataFileName = 'img/sprite-' + screenWidth + 'x' + screenHeight + '.json';

                    if (devicePixelRatio > 1) {
                        var imageWidth = Math.round(screenWidth * devicePixelRatio);
                        var imageHeight = Math.round(screenHeight * devicePixelRatio);
                        spritePNGFile = 'img/sprite-' + imageWidth + 'x' + imageHeight + '.png';
                        spriteDataFileName = 'img/sprite-' + imageWidth + 'x' + imageHeight + '.json';
                    }

                    console.log(spriteDataFileName);
                    console.log(spritePNGFile);

                    // check if file exists, if not default it
                    return $http.get(spriteDataFileName)
                        .then(function () {

                            var adjustment = {
                                scaleFactor: 1 / devicePixelRatio
                            };
                            return processImages(spriteDataFileName, spritePNGFile, adjustment)
                                .then(function (result) {
                                    imgOptions = result;
                                    return imgOptions;
                                });


                        }).catch(function (error) {

                            // TODO: choose most appropriate size to scale based on aspect ratio

                            imageWidth = 750;
                            imageHeight = 1334;

                            spritePNGFile = 'img/sprite-' + imageWidth + 'x' + imageHeight + '.png';
                            spriteDataFileName = 'img/sprite-' + imageWidth + 'x' + imageHeight + '.json';

                            var adjustment = {};

                            if (imageWidth / imageHeight > screenWidth / screenHeight) {

                                // scaled image height will be container height
                                // we will need a width factor
                                adjustment.type = 'width';
                                adjustment.scaleFactor = imageHeight / screenHeight;
                                var scaledWidth = imageWidth * adjustment.scaleFactor;
                                adjustment.size = (scaledWidth - screenWidth) / 2;

                            } else {

                                // scaled image width will be container width
                                // we will need a height factor
                                adjustment.type = 'height';
                                adjustment.scaleFactor = (screenWidth ) / imageWidth;
                                var scaledHeight = imageHeight * adjustment.scaleFactor;
                                adjustment.size = 0;//(scaledHeight - screenHeight ) / 4;
                            }

                            return processImages(spriteDataFileName, spritePNGFile, adjustment)
                                .then(function (result) {
                                    imgOptions = result;
                                    return imgOptions;
                                });

                        }).finally(function () {

                        });

                } else {
                    return imgOptions;
                }
            };



            function checkAndCreateFacebookLogin(authData, goalsQuestionsAnswers, scope) {

                return UserProfile(authData.uid).$loaded()
                    .then(function (profile) {
                        if (!profile.exists()) {
                            if (!goalsQuestionsAnswers) {

                                popup('', 'Your facebook account is not registered with LifeUp yet. First, set your goals then tap the \'sign up with facebook\' option.', 'intro', scope);
                                return;
                            } else {

                                var user = {
                                    email: authData.facebook.email
                                };

                                return profile.create(user, goalsQuestionsAnswers)
                                    .then(function () {

                                        $state.go('dashboard.dashboardHome');
                                        hideLoading();
                                        return;

                                    });
                            }
                        } else {
                            $state.go('dashboard.dashboardHome');
                            hideLoading();
                            return;
                        }
                    });
            }


            var timeFormatter = function (arg) {
                var sec_num = parseInt(arg, 10); // don't forget the second param
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);
                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                var time = minutes + ':' + seconds;
                return time;
            };

            var doCordovaFacebookLogin = function (goalsQuestionsAnswers, scope) {
                return $cordovaFacebook.login(["public_profile", "email"])
                    .then(function (success) {
                        var token = success.authResponse.accessToken;

                        return Auth.$authWithOAuthToken("facebook", token)
                            .then(function (authData) {
                                return checkAndCreateFacebookLogin(authData, goalsQuestionsAnswers, scope);
                            });
                    });
            };

            var facebookLogin = function (goalsQuestionsAnswers, scope) {

                var options = {
                    remember: "default",
                    scope: "email"
                };

                if (ionic.Platform.isWebView()) {

                    // turns out sometimes we need to call logout to get the plugin to work
                    // properly.
                    return $cordovaFacebook.logout()
                        .then(function () {
                            return doCordovaFacebookLogin(goalsQuestionsAnswers, scope);
                        }).catch(function (error) {
                            // if you have never had a facebook session before
                            // calling logout will fail. So we catch that and continue as normal.
                            return doCordovaFacebookLogin(goalsQuestionsAnswers, scope);
                        });
                }
                else {
                    return Auth.$authWithOAuthPopup("facebook", options).then(function (authData) {
                        return checkAndCreateFacebookLogin(authData, goalsQuestionsAnswers, scope);
                    });
                }
            };

            return {
                showLoading: showLoading,
                showLoadingInternet: showLoadingInternet,
                hideLoading: hideLoading,
                facebookLogin: facebookLogin,
                popup: popup,
                isOnline: isOnline,
                imageOptions: imageOptions,
                timeFormatter: timeFormatter,
                makeAndroidFullscreen: makeAndroidFullscreen,
                logout: logout
            };
        }
    ]);