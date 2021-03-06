'use strict';
(function() {
    var entertainmentAtlas = angular.module('entertainmentAtlas', ['720kb.socialshare', 'ui.router', 'ngAria', 'ngAnimate', 'ngSanitize', 'ngStorage']);

    entertainmentAtlas.config(['$stateProvider', '$httpProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        delete $httpProvider.defaults.headers.common['X-Requested-With'];

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
        $window.onload = function() {
            setTimeout(function() {
                $('#aboutModal').modal('show');
            }, 100);
        };
    }]);
}());
