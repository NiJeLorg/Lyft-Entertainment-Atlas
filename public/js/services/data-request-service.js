'use strict';
angular.module('entertainmentAtlas')
    .factory('Base64', function() {
        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        return {
            encode: function(input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function(input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    })
    .factory('DataService', function($http, $q, $httpParamSerializer, Base64, $localStorage) {
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
            var client_id = '4ujGa8RbFc5n';
            var client_secret = 'ndUxKLmGVe8CPVhG7xqCDrz9SCk5s5hY';
            var authdata = Base64.encode(client_id + ':' + client_secret);
            var data = {
                grant_type: 'client_credentials',
                scope: 'public'
            };
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            $http({
                method: 'POST',
                url: 'https://api.lyft.com/oauth/token',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: data
            }).then(function success(resp) {
                deferred.resolve(resp.data.access_token);
            }, function error(err) {
                deferred.reject(err);
                console.log(err);
            });
            return deferred.promise;
        };

        service.getRideEstimate = function() {
            var deferred = $q.defer();
            // geocode address first
            var trunkURL = 'https://maps.googleapis.com/maps/api/geocode/json';
            var address = $('#fromInput').val().replace(/ /g, '+');
            //var params = '?address='+address+'&key=AIzaSyBQxrEbrvIkajyXTw4fR6mXoP5HwmZPlaA';
            //var params = 'address='+address+', key=AIzaSyBQxrEbrvIkajyXTw4fR6mXoP5HwmZPlaA';
            // var params = {
            //     address: address,
            //     key: 'AIzaSyBQxrEbrvIkajyXTw4fR6mXoP5HwmZPlaA'
            // };
            $http({
                method: 'GET',
                url: trunkURL,
                params: params
            }).success(function(data) {
                // get lat lon and pass to lyft api
                var lat = data.results[0].geometry.location.lat;
                var lng = data.results[0].geometry.location.lng;
                console.log(lat, "lat");
                console.log(lng, "lng");
                var authdata = Base64.encode($scope.lyftAccessToken);
                var getURL = 'https://api.lyft.com/v1/cost?start_lat='+lat+'&start_lng='+lng+'&end_lat='+ $scope.selectedLocation.gsx$latitude.$t +'&end_lng='+ $scope.selectedLocation.gsx$longitude.$t;
                console.log(getURL);
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + authdata;
                $http({
                    method: 'GET',
                    url: getURL,
                }).then(function success(resp) {
                    deferred.resolve(resp);
                }, function error(err) {
                    deferred.reject(err);
                });

            }).error(function error(err) {
                console.log(err);
            });

            return deferred.promise;
        };

        return service;
    });
