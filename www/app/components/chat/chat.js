/**
 * Created by alexmady on 03/01/16.
 */
/* angular.module('lifeUp.chat', ['firebase'])

    .factory("Chat", ["$firebaseArray", "FIREBASE_URL",
        function($firebaseArray, FIREBASE_URL) {
            var ref = new Firebase(FIREBASE_URL + '/chat');
            return $firebaseArray(ref);
        }
    ]);