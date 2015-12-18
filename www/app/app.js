
angular.module('lifeUp', [
    'ionic',
    'ngCordova',
    'ngIOS9UIWebViewPatch',
    'firebase',
    'lifeUp.auth',
    'lifeUp.user',
    'lifeUp.util',
    'lifeUp.config',
    'lifeUp.home',
    'lifeUp.signInChoice',
    'lifeUp.privacyPolicy',
    'lifeUp.emailSignIn',
    'lifeUp.createAccount',
    'lifeUp.createAccountEmail',
    'lifeUp.dashboard',
    'lifeUp.course',
    'lifeUp.about',
    'lifeUp.what',
    'lifeUp.faq',
    'lifeUp.how',
    'lifeUp.account',
    'lifeUp.dashboardHome',
    'lifeUp.courseMetaData'
    ])

.run(['$ionicPlatform', '$rootScope', function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

      $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
          // We can catch the error thrown when the $requireAuth promise is rejected
          // and redirect the user back to the home page
          if (error === "AUTH_REQUIRED") {
              $location.path("/home");
          }
      });
  });

  // Whenever there is an update to authorization data from firebase
  /*Auth.ref.$onAuth(function(authData){

      $ionicLoading.hide();

      if (authData){
          User.setAuthData(authData);

          if (authData.provider === "facebook"){
              var user = { email: authData.facebook.email };
              FirebaseUtil.checkAndCreateUserProfile(authData, user);
          }
          $state.go('dashboard.dashboardHome');
      } else {
          $state.go('home');
      }
  });*/


}]).config(function($urlRouterProvider, $ionicConfigProvider){
    $urlRouterProvider.otherwise('/home');
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.text('');
});