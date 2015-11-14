/**
 * Created by alexmady on 06/11/15.
 */
angular.module('FirebaseUtil', [])

    .factory("FirebaseUtil", ["$firebase", 'FIREBASE_URL',
        function($firebase, FIREBASE_URL) {

            var ref = new Firebase(FIREBASE_URL + '/users');

            var createProfile = function(authData){
                return ref.set({ uid: authData.uid, nickname: 'nick', lastLogin: new Date() });
            };

            /*var updateLastLogin = function(){
                return ref.set{}
            };*/

            return {
                createProfile: createProfile
            };
        }
    ]);