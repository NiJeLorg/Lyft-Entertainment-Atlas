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
        return service;
    });
