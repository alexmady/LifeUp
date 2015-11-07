/**
 * Created by alexmady on 07/11/15.
 */

angular.module('Auth', [])

.factory("Auth", ["$firebaseAuth", 'FIREBASE_URL', '$state',
    function($firebaseAuth, FIREBASE_URL, $state) {
        var ref = new Firebase(FIREBASE_URL + '/users');
        var fauth = $firebaseAuth(ref);


        var login = function(user){

            fauth.$authWithPassword({
                email    : user.email,
                password : user.pass
            }).catch(function(error){
                console.log(error);
            });
        };


        fauth.$onAuth(function(data){

            console.log('auth data');
            console.log(data);
//            User.authData = data;

            if (data){
                console.log('going to dashboard');
                $state.go('dashboard');
            } else {
                console.log('going home');
                $state.go('home');
            }
        });

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