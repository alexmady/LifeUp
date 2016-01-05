/**
 * Created by alexmady on 07/11/15.
 */
'use strict';

angular.module('lifeUp.chat', [ ])

    .config( ['$stateProvider', function($stateProvider) {

        $stateProvider
            .state('dashboard.chat', {
                cache: false,
                url: "/chat",
                views: {
                    'dashboardContent': {
                        templateUrl: "app/dashboard/components/chat/chat.html",
                        controller: 'ChatCtrl'
                    }
                },
                resolve: {
                    // controller will not be loaded until $requireAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth", function (Auth) {
                        // $requireAuth returns a promise so the resolve waits for it to complete
                        // If the promise is rejected, it will throw a $stateChangeError (see above)
                        return Auth.$requireAuth();
                    }],
                    "profile": [ "UserProfile", "Auth", function (UserProfile, Auth) {
                        return UserProfile(Auth.$getAuth().uid).$loaded();
                    }]
                }
            })
    }])

    .controller('ChatCtrl', [ '$scope', 'Messages', '$ionicScrollDelegate', '$timeout', 'profile', 'Auth',
        function( $scope, Messages, $ionicScrollDelegate, $timeout, profile, Auth ) {


            Auth.$onAuth(function(data){
                $scope.authData = data;
            });

        $scope.messages = Messages;
        $scope.userFirstName = profile.firstname;
        $scope.userID = profile.$id;

        $scope.addMessage = function(messageForm) {

            var messageData = {};
            messageData.text = $scope.input.message;
            messageData._id = new Date().getTime(); // :~)
            messageData.date = new Date().getTime();
            messageData.userFirstName = $scope.userFirstName;
            messageData.userID = profile.$id;

            $scope.input.message = '';

            $scope.messages.$add(messageData);

            $timeout(function() {
                //keepKeyboardOpen();
                viewScroll.scrollBottom(true);
            }, 0);
        };


        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        var footerBar; // gets set in $ionicView.enter
        var scroller;
        var txtInput; // ^^^

        $scope.$on('$ionicView.enter', function() {
            console.log('UserMessages $ionicView.enter');

            $timeout(function() {
                footerBar = document.body.querySelector('#userMessagesView .bar-footer');
                scroller = document.body.querySelector('#userMessagesView .scroll-content');
                txtInput = angular.element(footerBar.querySelector('textarea'));
            }, 0);
        });

    }])// fitlers
    .filter('nl2br', ['$filter',
        function($filter) {
            return function(data) {
                if (!data) return data;
                return data.replace(/\n\r?/g, '<br />');
            };
        }
    ]);