/**
 * Created by alexmady on 10/12/15.
 */

angular.module('lifeUp.util', ['ionic'])

    .factory('Util', ['$ionicLoading', '$cordovaFacebook', 'Auth', 'UserProfile', '$state', '$ionicPopup', '$cordovaNetwork', '$window', '$http', 'CourseCodes',

        function ($ionicLoading, $cordovaFacebook, Auth, UserProfile, $state, $ionicPopup, $cordovaNetwork, $window, $http, CourseCode) {

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


            var isOnline = function () {
                var online = $cordovaNetwork.isOnline();
                return online;
            };

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
                                    //ioniconsole.log(posInfo);
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
            };


            var imgOptions = null;

            // returns a promise thta is resolved once the json file has been loaded
            var imageOptions = function () {

                if (imgOptions === null) {

                    var screenWidth = $window.screen.width;
                    var screenHeight = $window.screen.height;
                    var innerWidth = $window.innerWidth;
                    var innerHeight = $window.innerHeight;

                    console.log('sw ' + screenWidth + ' sh ' + screenHeight + ' iw ' + innerWidth + ' ih ' + innerHeight);

                    // inner height is less on android when part of the screen is being used as
                    // the buttons area.

                    screenWidth = innerWidth;
                    screenHeight = innerHeight;

                    var devicePixelRatio = $window.devicePixelRatio;

                    var spritePNGFile = 'img/sprite-' + screenWidth + 'x' + screenHeight + '.png';
                    var spriteDataFileName = 'img/sprite-' + screenWidth + 'x' + screenHeight + '.json';

                    if (devicePixelRatio > 1) {
                        var imageWidth = screenWidth * devicePixelRatio;
                        var imageHeight = screenHeight * devicePixelRatio;
                        spritePNGFile = 'img/sprite-' + imageWidth + 'x' + imageHeight + '.png';
                        spriteDataFileName = 'img/sprite-' + imageWidth + 'x' + imageHeight + '.json';
                    }

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

                            console.log('scaling....');
                            // TODO: choose most appropriate size to scale based on aspect ratio

                            imageWidth = 1125;
                            imageHeight = 2001;

                            spritePNGFile = 'img/sprite-' + imageWidth + 'x' + imageHeight + '.png';
                            spriteDataFileName = 'img/sprite-' + imageWidth + 'x' + imageHeight + '.json';

                            var adjustment = {};

                            if (imageWidth / imageHeight > screenWidth / screenHeight) {

                                console.log('fit to height');
                                // scaled image height will be container height
                                // we will need a width factor
                                adjustment.type = 'width';
                                adjustment.scaleFactor = imageHeight / screenHeight;
                                var scaledWidth = imageWidth * adjustment.scaleFactor;
                                adjustment.size = (scaledWidth - screenWidth) / 2;

                            } else {

                                console.log('fit to width');
                                // scaled image width will be container width
                                // we will need a height factor
                                adjustment.type = 'height';
                                adjustment.scaleFactor = (screenWidth ) / imageWidth;
                                var scaledHeight = imageHeight * adjustment.scaleFactor;
                                console.log('scaled height: ' + scaledHeight);
                                adjustment.size = (scaledHeight - screenHeight ) / 2;
                            }

                            console.log(adjustment);
                            return processImages(spriteDataFileName, spritePNGFile, adjustment)
                                .then(function (result) {
                                    imgOptions = result;
                                    return imgOptions;
                                });

                        }).finally(function () {

                            console.log(" deviceW: " + screenWidth + " deviceH: " + screenHeight +
                                " devicePixelRatio: " + devicePixelRatio + " sprite: " + spritePNGFile +
                                " data: " + spriteDataFileName);
                        });

                } else {
                    return imgOptions;
                }
            };

            function validateCourseCode(code, scope, goalQuestionsAnswers, profile, authData) {

                return CourseCode.$loaded()
                    .then(function () {

                        var cc = CourseCode[code];
                        if (!cc) {
                            throw new Error('The course code you entered does not exist.');
                        } else {

                            if (!cc.used) {

                                var user = {
                                    email: authData.facebook.email,
                                    //firstname: authData.facebook.cachedUserProfile.first_name,
                                    //surname: authData.facebook.cachedUserProfile.last_name,
                                    tag: cc.tag,
                                    courseCode: code
                                };

                                return profile.create(user, goalQuestionsAnswers)
                                    .then(function () {
                                        cc.used = true;
                                        return CourseCode.$save()
                                            .then(function(){
                                                $state.go('dashboard.dashboardHome');
                                                hideLoading();
                                                return;
                                            });
                                    });
                            } else {
                                throw new Error('The course code you specified is no longer available.');
                            }
                        }
                    });
            };

            function checkAndCreateFacebookLogin(authData, goalsQuestionsAnswers, scope) {

                return UserProfile(authData.uid).$loaded()
                    .then(function (profile) {

                        if (!profile.exists()) {

                            console.log('checkAndCreateFacebookLogin: profile does not exist');
                            if (!goalsQuestionsAnswers){

                                popup('','Your facebook account is not registered with LifeUp yet. First, set your goals then tap the \'sign up with facebook\' option.', 'intro', scope);
                                return;
                            }

                            scope.data = {};

                            scope.blurBackground = true;

                            var myPopup = $ionicPopup.prompt({
                                template: '<input autofocus style="text-align: center; background-color: cornflowerBlue" type="text" placeholder="" ng-model="data.courseCode">',
                                title: '<p class="lifeup-text">Please enter your Course Code below:</p>',
                                cssClass: 'course-code-popup',
                                scope: scope,
                                buttons: [
                                    {
                                        text: 'CANCEL',
                                        type: 'button button-outline button-light'
                                    },
                                    {
                                        text: '<b>GO</b>',
                                        type: 'button button-outline button-light',
                                        onTap: function (e) {
                                            if (!scope.data.courseCode) {
                                                //don't allow the user to close unless he enters a course code
                                                e.preventDefault();
                                            } else {
                                                return scope.data.courseCode;
                                            }
                                        }
                                    }
                                ]
                            });

                            hideLoading();

                            return myPopup.then(function (code) {

                                scope.blurBackground = false;
                                if (!code) return;

                                return validateCourseCode(code, scope, goalsQuestionsAnswers, profile, authData)
                                    .then(function(){

                                        return;

                                    }).catch(function(error){

                                        scope.blurBackground = true;

                                        var errPop = $ionicPopup.prompt({
                                            title: '',
                                            template: '<p class="lifeup-earnt-badge center" style="text-align: center">' + error.message + '</p>',
                                            cssClass: 'course-label-popup',
                                            buttons: [
                                                {
                                                    text: 'OK',
                                                    type: 'button button-outline button-light'
                                                }
                                            ]
                                        });

                                        return errPop.then(function(){
                                            scope.blurBackground = false;
                                            return checkAndCreateFacebookLogin(authData, goalsQuestionsAnswers, scope);
                                        });

                                    });
                            });
                        } else {
                            console.log('profile already exists - redirecting to home');
                            $state.go('dashboard.dashboardHome');
                            hideLoading();
                            return;
                        }
                    });
            };

            var timeFormatter = function (arg) {
                var sec_num = parseInt(arg, 10); // don't forget the second param
                var hours   = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);
                if (hours   < 10) {hours   = "0"+hours;}
                if (minutes < 10) {minutes = "0"+minutes;}
                if (seconds < 10) {seconds = "0"+seconds;}
                var time    = minutes+':'+seconds;
                return time;
            };

            var facebookLogin = function (goalsQuestionsAnswers, scope) {

                var options = {
                    remember: "default",
                    scope: "email"
                };

                if (ionic.Platform.isWebView()) {
                    console.log('facebook login: this IS a web view');

                    return $cordovaFacebook.logout().then(function(){
                        return $cordovaFacebook.login(["public_profile", "email"])
                            .then(function (success) {
                                var token = success.authResponse.accessToken;
                                console.log('got the access token: ' + token)
                                return Auth.$authWithOAuthToken("facebook", token)
                                    .then(function (authData) {
                                        checkAndCreateFacebookLogin(authData, goalsQuestionsAnswers, scope);
                                    });
                            });
                    });
                }
                else {

                    console.log('fackebook login: not web view');
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
                timeFormatter: timeFormatter
            };
        }
    ]);