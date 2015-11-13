/**
 * Created by alexmady on 06/11/15.
 */
angular.module('firebase', [])

    .factory("FirebaseUtils", ["$firebase", 'FIREBASE_URL', '$ionicPopup',
        function($firebaseAuth, FIREBASE_URL, $ionicPopup) {

            var ref = new Firebase(FIREBASE_URL + '/users');
            var profileRef = ref.child('profile');

            var createProfile = function(authData, user){
                return profileRef.$set(authData.uid, user)
            };

            return {
                createProfile: createProfile
            };

        }
    ]);