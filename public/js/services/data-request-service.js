'use strict';
angular.module('entertainmentAtlas')
    .factory('DataService', function($http, $q) {
        var service = {};

        service.fetchData = function() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'https://spreadsheets.google.com/feeds/list/1UQDU57hHK7w9NQpu7u0yFrtac2Xgfkn1YfRSaUP6AsY/od6/public/values?alt=json'
            }).then(function success(resp) {
                deferred.resolve(resp);
            }, function error(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        service.connectToLyft = function() {
            var deferred = $q.defer();
            $http.post('https://api.lyft.com/oauth/token', {
                url: 'https://api.lyft.com/oauth/token',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    client_id: '4ujGa8RbFc5n',
                    client_secret: 'ndUxKLmGVe8CPVhG7xqCDrz9SCk5s5hY',
                    'grant_type': 'client_credentials',
                    'scope': 'public'
                }
            }).then(function(resp) {
                console.log(resp);
            }, function(err) {
                console.log(err);
            });
            return deferred.promise;
        };
        return service;
    });
