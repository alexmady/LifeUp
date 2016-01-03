angular.module('lifeUp', [
    'ionic',
    'ngCordova',
    'ngIOS9UIWebViewPatch',
    'firebase',
    'lifeUp.appService',
    'lifeUp.auth',
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
    'lifeUp.instructions',
    'lifeUp.what',
    'lifeUp.faq',
    'lifeUp.how',
    'lifeUp.account',
    'lifeUp.dashboardHome',
    'lifeUp.courseMetaData'
])

    .run(['$ionicPlatform', '$rootScope', '$cordovaStatusbar', 'AppService', '$state',
        function ($ionicPlatform, $rootScope, $cordovaStatusbar, AppService, $state) {
        $ionicPlatform.ready(function () {

            console.log('Starting....');

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                //$cordovaStatusbar.hide();
            }

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }


            document.addEventListener("resume", function () {
                console.log("The application is resuming from the background");
            }, false);

            $rootScope.appService = AppService;

            AppService.$watch(function(){

                if (AppService.enableApp === false){
                    $state.go('home');
                }
            });

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

    }]).config(function ($urlRouterProvider, $ionicConfigProvider) {
        $urlRouterProvider.otherwise('/home');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.backButton.text('');
    });