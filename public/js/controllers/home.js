'use strict';
angular.module('entertainmentAtlas')
    .controller('HomeCtrl', function($scope, DataService) {
        var L = window.L;
        var map = new L.Map('map').setView([41.8914184, -87.6116459], 11);
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
            attribution: 'Positron'
        }).addTo(map);
        var redMarker = new L.Icon({
            iconSize: [20, 32],
            iconAnchor: [13, 27],
            popupAnchor: [13, -30],
            iconUrl: '../images/marker.svg',
        });
        DataService.fetchData().then(function(data) {
            $scope.data = data.data.feed.entry;
            for (var i = 0; i < $scope.data.length; i++) {
                angular.forEach($scope.data[i], function(value, key) {
                    L.marker([$scope.data[i].gsx$latitude.$t, $scope.data[i].gsx$longitude.$t], { icon: redMarker }).addTo(map);
                });
            }
        }, function(err) {
            console.log('There was an error: ' + err);
        });
    });
