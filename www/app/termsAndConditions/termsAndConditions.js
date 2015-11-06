/**
 * Created by alexmady on 06/11/15.
 */
'use strict';

angular.module('lifeUp.termsAndConditions', [])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('termsAndConditions', {
                url: '/termsAndConditions',
                templateUrl: 'app/termsAndConditions/termsAndConditions.html',
                controller: 'TermsAndConditionsCtrl'
            })
    }])

    .controller('TermsAndConditionsCtrl', [ '$scope', '$state', function($scope, $state) {

        $scope.goBack = function(){
            $state.go('')
        }

    }]);