/**
 * Created by alexmady on 07/11/15.
 */
angular.module('User', [])

    .service('User', function () {
        this.authData = {};

        this.updateCourseProgress = function( module, slide ){

            // update users position in the course here
            console.log('Course module ' + module + ' slide ' + slide);
        };
    });

