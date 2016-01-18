(function () {
    'use strict';

    angular.module('lifeUp.privacyPolicy', [])

        .config( ['$stateProvider', function($stateProvider) {

            $stateProvider
                .state('privacyPolicy', {
                    url: '/privacyPolicy',
                    templateUrl: 'privacyPolicy.html',
                    controller: 'PrivacyPolicyCtrl'
                });
        }])

        .controller('PrivacyPolicyCtrl', [ '$scope', '$state', function($scope, $state) {

            $scope.goBack = function(){
                $state.go('signInChoice');
            };

        }]);
}());
