/**
 * Created by alexmady on 07/11/15.
 */

angular.module('Auth', [])

.factory("Auth", ["$firebaseAuth", 'FIREBASE_URL',
    function($firebaseAuth, FIREBASE_URL) {
        var ref = new Firebase(FIREBASE_URL + '/users');

        return $firebaseAuth(ref);
    }
]);