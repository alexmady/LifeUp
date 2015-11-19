/**
 * Created by alexmady on 06/11/15.
 */
angular.module('FirebaseUtil', [])

    .factory("FirebaseUtil", ["$firebase", 'FIREBASE_URL',
        function($firebase, FIREBASE_URL) {

            var ref = new Firebase(FIREBASE_URL + '/users');

            var createProfile = function(authData, user){

                var uid = authData.uid;
                var dt = new Date();

                var value = {};
                value[uid] = {
                    created: dt.getTime(),
                    module:0,
                    slide: 0,
                    moduleFar: 0,
                    slideFar: 0,
                    email: user.email };

                var callback = function(error){
                    if (error){
                        console.log(error);
                    } else {
                        console.log('Synchronization succeeded');
                    }
                };

                return ref.update(value, callback);
            };


            var checkAndCreateUserProfile = function( authData, user ){

                var checkRef = ref.child(authData.uid);
                checkRef.once("value",function(snapshot){

                    var exists = snapshot.exists();

                    console.log('Does facebook user profile exist?');
                    console.log(exists);

                    if (!exists){
                        createProfile( authData, user );
                    }

                });
            };

            return {
                createProfile: createProfile,
                checkAndCreateUserProfile: checkAndCreateUserProfile
            };
        }
    ]);