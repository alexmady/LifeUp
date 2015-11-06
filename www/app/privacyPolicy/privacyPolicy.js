/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.privacyPolicy', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('privacyPolicy', {
                url: '/privacyPolicy',
                templateUrl: 'app/privacyPolicy/privacyPolicy.html',
                controller: 'PrivacyPolicyCtrl'
            })
    }])

    .controller('PrivacyPolicyCtrl', [ '$scope', '$state', function($scope, $state) {

        $scope.goBack = function(){
            $state.go('signInChoice')
        }

    }]);