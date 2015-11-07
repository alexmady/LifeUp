// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('lifeUp', [
    'ionic',
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
    'Auth',
    'User'])

.run(function($ionicPlatform, $rootScope, Auth, User, $state) {
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

  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    $rootScope.previousState = from;
  });

  Auth.ref.$onAuth(function(data){

      console.log('auth data');
      console.log(data);
      User.authData = data;

      if (data){
          console.log('going to dashboard');
          $state.go('dashboard.course');
      } else {
          console.log('going home');
          $state.go('home');
      }
  });

}).config(function($urlRouterProvider){

    $urlRouterProvider.otherwise('/home')
});

