'use strict';
(function() {
    var entertainmentAtlas = angular.module('entertainmentAtlas', ['720kb.socialshare', 'ui.router', 'ngAria', 'ngAnimate', 'ngSanitize']);

    entertainmentAtlas.config(['$stateProvider', '$httpProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeCtrl',
                templateUrl: 'views/home.html'
            });

        // Remove hash from url paths
        $locationProvider.html5Mode(true);

    }]);

    entertainmentAtlas.run(['$window', function($window) {
        // $window.onload = function() {
        //     $('#aboutModal').modal('show');
        // };
    }]);
}());
