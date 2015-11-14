/**
 * Created by alexmady on 06/11/15.
 */
angular.module('FirebaseUtil', [])

    .factory("FirebaseUtil", ["$firebase", 'FIREBASE_URL',
        function($firebase, FIREBASE_URL) {

            var ref = new Firebase(FIREBASE_URL + '/users');

            var createProfile = function(authData){
                return ref.update({ uid: authData.uid, firstLogin: new Date() });
            };

            /*var updateLastLogin = function(){
                return ref.set{}
            };*/

            var updateProfile = function(module, slide){

                return ref.update({ uid: authData.uid, module: module, slide: slide });

            };

            return {
                createProfile: createProfile
            };
        }
    ]);