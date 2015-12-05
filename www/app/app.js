// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('lifeUp', [
    'ionic',
    'ngIOS9UIWebViewPatch',
    'firebase',
    'lifeUp.config',
    'lifeUp.home',
    'lifeUp.signInChoice',
    'lifeUp.termsAndConditions',
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
    'lifeUp.dashboardHome',
    'Auth',
    'FirebaseUtil',
    'User'])

.run(['$ionicPlatform', '$rootScope', 'Auth', 'User', '$state', 'FirebaseUtil', '$ionicLoading',
        function($ionicPlatform, $rootScope, Auth, User, $state, FirebaseUtil, $ionicLoading ) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  // Whenever there is an update to authorization data from firebase
  Auth.ref.$onAuth(function(authData){

      $ionicLoading.hide();

      console.log('onauth: ');
      console.log(authData);

      if (authData){
          User.setAuthData(authData);

          if (authData.provider === "facebook"){
              var user = { email: authData.facebook.email };
              FirebaseUtil.checkAndCreateUserProfile(authData, user);
          }
          console.log('Going to dashboard.course');
          $state.go('dashboard.dashboardHome');
      } else {
          $state.go('home');
      }
  });

}]).config(function($urlRouterProvider, $ionicConfigProvider){
    $urlRouterProvider.otherwise('/home');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.text('');
});