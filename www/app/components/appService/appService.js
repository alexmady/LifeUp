/**
 * Created by alexmady on 29/12/15.
 */

angular.module('lifeUp.appService', ['firebase'])

    .factory("AppService", ["$firebaseObject", "FIREBASE_URL",
        function($firebaseObject, FIREBASE_URL) {
            var ref = new Firebase(FIREBASE_URL + '/appService');
            return $firebaseObject(ref);
        }
    ]);
