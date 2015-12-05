/**
 * Created by alexmady on 07/11/15.
 */
angular.module('Auth', [])

.factory('Auth', ['$firebaseAuth', '$firebaseObject', 'FIREBASE_URL', '$ionicPopup', 'User', '$ionicLoading',
    function($firebaseAuth, $firebaseObject, FIREBASE_URL, $ionicPopup, User, $ionicLoading) {

        var ref = new Firebase(FIREBASE_URL + '/users');
        var fauth = $firebaseAuth(ref);

        var login = function(user){

            try{
                fauth.$authWithPassword({
                    email    : user.email,
                    password : user.pass
                }).then(function(data){
                    //console.log('User logged in:');
                    //console.log(data);

                    // when the user logs in set up the angular fire binding to keep the
                    // user automatically updated

                }).catch(function(error){
                    // An alert dialog

                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: "Sorry we didn't recognise that email address / password."
                    });
                    alertPopup.then(function(res) {
                        return;
                    });
                    console.log(error);
                });
            } catch (error){

                var msg = 'Unknown Error, please try again.';

                if (!user || !user.email || !user.pass){
                    msg = 'Either email address or password was not specified. Please try again. ';
                }

                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: msg
                });
                alertPopup.then(function(res) {
                    return;
                });
            }
        };

        var facebookLogin = function(){

            //console.log('facebook login');

            var options = {
              remember: "default",
              scope: "email"
            };

            fauth.$authWithOAuthRedirect("facebook", options).then(function(authData) {

            }).catch(function(error) {
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                    fauth.$authWithOAuthPopup("facebook", options).then(function(authData) {
                        // User successfully logged in. We can log to the console
                        // since we’re using a popup here
                        console.log(authData);
                    });
                } else {
                    // Another error occurred
                    console.log(error);
                }
            });
        };


        var logout = function(){
           User.logout();
           fauth.$unauth();
        };

        return {
            ref: fauth,
            logout: logout,
            login: login,
            facebookLogin: facebookLogin
        };

    }
]);