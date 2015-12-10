/**
 * Created by alexmady on 10/12/15.
 */

angular.module('lifeUp.util', ['ionic'])

    .factory('Util', ['$ionicLoading',

        function($ionicLoading) {

            var showLoading = function(){
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles"></ion-spinner>'
                });
            };

            var hideLoading = function() {
                $ionicLoading.hide();
            };

            return {
                showLoading: showLoading,
                hideLoading: hideLoading
            }
        }
    ]);