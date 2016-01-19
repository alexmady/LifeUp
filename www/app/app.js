angular.module('lifeUp', [
    'ionic',
    'ngCordova',
    'rzModule',
    'monospaced.elastic',
    'angularMoment',
    //'ngIOS9UIWebViewPatch',
    'ionic-native-transitions',
    'ionic.ion.imageCacheFactory',
    'firebase',
    'lifeUp.appService',
    'lifeUp.auth',
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

            $ionicPlatform.ready(function () {

                Util.makeAndroidFullscreen();

                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }

                if (window.StatusBar) {
                    window.StatusBar.hide();
                    ionic.Platform.fullScreen();
                }

                $cordovaStatusbar.hide();

                $rootScope.$on("$routeChangeError", function (event, next, previous, error) {

                    console.error('route change error');
                    console.error(error);

                    // We can catch the error thrown when the $requireAuth promise is rejected
                    // and redirect the user back to the home page
                    if (error === "AUTH_REQUIRED") {
                    }
                });

                $rootScope.$on("$stateChangeError", function (event, next, previous, error) {

                    console.error('state change error');
                    console.error(error);
                    // We can catch the error thrown when the $requireAuth promise is rejected
                    // and redirect the user back to the home page
                    if (error === "AUTH_REQUIRED") {
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

        $ionicNativeTransitionsProvider.setDefaultTransition({
            type: 'slide',
            direction: 'left'
        });

        $ionicNativeTransitionsProvider.setDefaultBackTransition({
            type: 'slide',
            direction: 'right'
        });
    }]);