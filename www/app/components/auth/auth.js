/**
 * Created by alexmady on 07/11/15.
 */
angular.module('Auth', [])

.factory("Auth", ["$firebaseAuth", 'FIREBASE_URL', '$ionicPopup',
    function($firebaseAuth, FIREBASE_URL, $ionicPopup) {

        var ref = new Firebase(FIREBASE_URL + '/users');
        var fauth = $firebaseAuth(ref);

        var login = function(user){

            fauth.$authWithPassword({
                email    : user.email,
                password : user.pass
            }).catch(function(error){
                // An alert dialog

                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: "Sorry we didn't recognise that email address / password."
                    });
                    alertPopup.then(function(res) {

                    });
                console.log(error);
            });
        };

        var facebookLogin = function(){

            console.log('facebook login');
            fauth.$authWithOAuthRedirect("facebook").then(function(authData) {

            }).catch(function(error) {
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                    fauth.$authWithOAuthPopup("facebook").then(function(authData) {
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