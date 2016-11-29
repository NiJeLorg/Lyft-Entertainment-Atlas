'use strict';
angular.module('entertainmentAtlas')
    .controller('HomeCtrl', function($scope, DataService) {
        $scope.openLocationModal = false;
        $scope.openLocationModalAction = function(item) {
            $scope.openLocationModal = true;
            $scope.locationItem = item;
            console.log($scope.locationItem.gsx$story, 'LOCATION ITEM');
        };
        $scope.closeLocationModalAction = function() {
            $scope.openLocationModal = false;
        };
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
            console.log(data, 'DATA');
            for (var i = 0; i < $scope.data.length; i++) {
                angular.forEach($scope.data[i], function(value, key) {
                    console.log($scope.data[i].gsx$name, 'NAME');
                    L.marker([$scope.data[i].gsx$latitude.$t, $scope.data[i].gsx$longitude.$t], { icon: redMarker }).addTo(map).bindPopup('<div class="marker-popup-content"><div class="marker-popup-info"><h2>Suada</h2><p>Teddy</p><button>Book a ride!</button></div><div class="marker-popupimage"></div></div>');
                });
            }
        }, function(err) {
            console.log('There was an error: ' + err);
        });
    });
