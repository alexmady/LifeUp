/**
 * Created by alexmady on 03/01/16.
 */
 angular.module('lifeUp.courseCodes', ['firebase'])

    .factory("CourseCodes", ["$firebaseObject", "FIREBASE_URL",
        function($firebaseObject, FIREBASE_URL) {
            var ref = new Firebase(FIREBASE_URL + '/courseCodes');
            return $firebaseObject(ref);
        }
    ]);