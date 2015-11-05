/**
 * Created by alexmady on 05/11/15.
 */
'use strict';

angular.module('lifeUp.config', [])

    .constant('VERSION', '0.0.1')

    .constant('FIREBASE_URL', 'https://fiery-inferno-2530.firebaseio.com')

    .constant('AUTH_EVENTS', {
        NOT_AUTHENTICATED: 'auth-not-authenticated'
    })

    .run(['FIREBASE_URL', function(FIREBASE_URL){

        console.log(FIREBASE_URL);

    }]);