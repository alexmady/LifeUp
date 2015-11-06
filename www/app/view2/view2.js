/**
 * Created by alexmady on 05/11/15.
 */
'use strict';

angular.module('lifeUp.view2', [])

    .config(['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('view2', {
                url: '/view2',
                templateUrl: 'app/view2/view2.html',
                controller: 'View2Ctrl'
            })

    }])

    .controller('View2Ctrl', [ '$state', '$scope', function($state, $scope) {


        $scope.goToIntro = function(){
            $state.go('view1')
        }
    }]);