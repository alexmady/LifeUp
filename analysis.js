/**
 * Created by alexmady on 08/02/16.
 */



// Create a callback to handle the result of the authentication
function authHandler(error, authData) {
    if (error) {
        console.log("Login Failed!", error);
    } else {
        console.log("Authenticated successfully with payload:", authData);


        myFirebaseRef.child("users").on("value", function(snapshot) {

            var data = snapshot.val();

            for (var key in data){
                var user = data[key];
                var created = new Date(user.created);
                var lastActivityDate = new Date(user.lastActivityDate);
                var span = lastActivityDate - created;



                console.log(user.email + ', ' + created.toISOString().substring(0, 10) + ', ' + lastActivityDate.toISOString().substring(0, 10) + ', ' + user.moduleFar+ ', ' + user.slideFar + ', ' + (user.audioHistory ? 'Audios played' : 'Audios not played'));
            }


        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

    }
}


console.log('analysis starting...');

var Firebase = require("firebase");

var myFirebaseRef = new Firebase("https://fiery-inferno-2530.firebaseio.com/");


// Or with an email/password combination
myFirebaseRef.authWithPassword({
    email    : 'alex@test.com',
    password : 'gggg'
}, authHandler);


