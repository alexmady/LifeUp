/**
 * Created by alexmady on 03/01/16.
 */
 angular.module('lifeUp.messages', ['firebase'])

    .factory("Messages", ["$firebaseArray", "FIREBASE_URL",
        function($firebaseArray, FIREBASE_URL) {
            var ref = new Firebase(FIREBASE_URL + '/messages');
            return $firebaseArray(ref);
        }
    ]);