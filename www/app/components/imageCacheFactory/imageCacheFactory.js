/**
 * Created by alexmady on 13/01/16.
 */
angular.module('ionic.ion.imageCacheFactory', [])

    .factory('$ImageCacheFactory', ['$q', function($q) {
        return {
            Cache: function(urls) {
                if (!(urls instanceof Array))
                    return $q.reject('Input is not an array');

                var promises = [];


                var deferredResolve = function(deferred){
                    deferred.resolve();
                };

                var deferredReject = function(deferred, url){
                    deferred.reject(url);
                };

                for (var i = 0; i < urls.length; i++) {
                    var deferred = $q.defer();
                    var img = new Image();

                    img.onload = deferredResolve(deferred);
                    img.onerror = deferredReject(deferred,urls[i]);

                    promises.push(deferred.promise);
                    img.src = urls[i];
                }

                return $q.all(promises);
            }
        };
    }]);