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
    'Auth',
    'FirebaseUtil',
    'User'])

.run(['$ionicPlatform', '$rootScope', 'Auth', 'User', '$state', function($ionicPlatform, $rootScope, Auth, User, $state) {
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

  Auth.ref.$onAuth(function(data){

      console.log('onauth - ' + data);

      if (data){
          User.setAuthData(data);
          $state.go('dashboard.course');
      } else {
          $state.go('home');
      }
  });

}]).config(function($urlRouterProvider, $ionicConfigProvider){
    //$ionicConfigProvider.navBar.transition('none');

        $urlRouterProvider.otherwise('/home');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.text('');
});

