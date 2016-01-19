angular.module('lifeUp', [
    'ionic',
    'ngCordova',
    'rzModule',
    'monospaced.elastic',
    'angularMoment',
    'ngIOS9UIWebViewPatch',
    'ionic-native-transitions',
    'ionic.ion.imageCacheFactory',
    'firebase',
    'lifeUp.appService',
    'lifeUp.auth',
    //'lifeUp.chat',
    'lifeUp.messages',
    'lifeUp.courseCodes',
    'lifeUp.user',
    'lifeUp.util',
    'lifeUp.config',
    'lifeUp.home',
    'lifeUp.intro',
    'lifeUp.privacyPolicy',
    'lifeUp.emailSignIn',
    'lifeUp.createAccount',
    'lifeUp.createAccountEmail',
    'lifeUp.dashboard',
    'lifeUp.course',
    'lifeUp.audio',
    'lifeUp.audioPlayer',
    'lifeUp.instructions',
    'lifeUp.what',
    'lifeUp.faq',
    'lifeUp.how',
    'lifeUp.account',
    'lifeUp.dashboardHome',
    'lifeUp.courseMetaData',
    'templates'
])

    .run(['$ionicPlatform', '$rootScope', '$cordovaStatusbar', 'AppService', '$state', 'Util', '$ImageCacheFactory',
        function ($ionicPlatform, $rootScope, $cordovaStatusbar, AppService, $state, Util, $ImageCacheFactory) {

            Util.showLoading();

            //console.log('start preloading images');
            /* $ImageCacheFactory.Cache(
             [

             'img/mm-750x1334.png',
             'img/sprite-750x1334.png',

             'img/mm-720x1280.png',
             'img/sprite-720x1280.png'

             ]).then(function(){
             console.log("done preloading!" + new Date());
             },function(failed){
             console.log("An image filed: "+failed);
             });*/


            $ionicPlatform.ready(function () {

                /*var started = Date.now();

                var sprite = new Image();
                sprite.onload = onImgLoad;
                sprite.onerror = onImgError;

                var mountain = new Image();
                mountain.onload = onImgLoad;
                mountain.onerror = onImgError;

                function onImgLoad() {
                    console.log('image loaded:');
                    console.log(this.src);
                    var ended = +Date.now();
                    console.log(ended - started);
                }

                function onImgError() {
                    console.log(this.src);
                    console.log('image loading error');
                }

                sprite.src = "img/sprite-720x1280.png";
                mountain.src = "img/mm-720x1280.png";*/

                if (ionic.Platform.isAndroid()){
                    Util.makeAndroidFullscreen();
                }

                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }

                if (window.StatusBar) {
                    //StatusBar.styleDefault();
                    StatusBar.hide();
                    ionic.Platform.fullScreen();
                }

                $cordovaStatusbar.hide();

                //pre load the image options
                Util.imageOptions();

                $rootScope.$on("$routeChangeError", function (event, next, previous, error) {

                    console.error('route change error');
                    console.error(error);

                    // We can catch the error thrown when the $requireAuth promise is rejected
                    // and redirect the user back to the home page
                    if (error === "AUTH_REQUIRED") {
                        console.log('AUTH REQUIRED');

                    }
                });

                $rootScope.$on("$stateChangeError", function (event, next, previous, error) {

                    console.error('state change error');
                    console.error(error);
                    // We can catch the error thrown when the $requireAuth promise is rejected
                    // and redirect the user back to the home page
                    if (error === "AUTH_REQUIRED") {
                        console.log('AUTH REQUIRED');
                        $state.go('home');
                    }
                });

            });




        }]).config([ '$urlRouterProvider', '$ionicConfigProvider', '$ionicNativeTransitionsProvider', function ($urlRouterProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider) {

        $urlRouterProvider.otherwise('/home');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.scrolling.jsScrolling(false); // PERFORMANCE
        //$ionicConfigProvider.views.maxCache(5); // PERFORMANCE

        $ionicNativeTransitionsProvider.setDefaultTransition({
            type: 'slide',
            direction: 'left'
        });

        $ionicNativeTransitionsProvider.setDefaultBackTransition({
            type: 'slide',
            direction: 'right'
        });
    }]);