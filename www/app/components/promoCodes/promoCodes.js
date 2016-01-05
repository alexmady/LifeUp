/**
 * Created by alexmady on 03/01/16.
 */
 angular.module('lifeUp.promoCodes', ['firebase'])

    .factory("PromoCodes", ["$firebaseObject", "FIREBASE_URL",
        function($firebaseObject, FIREBASE_URL) {
            var ref = new Firebase(FIREBASE_URL + '/promoCodes');
            return $firebaseObject(ref);
        }
    ]);