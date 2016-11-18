'use strict';
(function() {
    var entertainmentAtlas = angular.module('entertainmentAtlas', ['ui.router', 'ngAria', 'ngAnimate', 'ngMaterial']);

    entertainmentAtlas.config(['$stateProvider', '$httpProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html'
            });

        // Remove hash from url paths
        $locationProvider.html5Mode(true);

    }]);
}());
