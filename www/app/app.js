
angular.module('lifeUp', [
    'ionic',
    'ngIOS9UIWebViewPatch',
    'firebase',
    'User',
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
    'lifeUp.account',
    'lifeUp.dashboardHome',
    'FirebaseUtil'])

.run(['$ionicPlatform',function($ionicPlatform) {
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