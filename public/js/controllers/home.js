'use strict';
angular.module('entertainmentAtlas')
    .controller('HomeCtrl', function($scope, DataService) {
        $scope.openLocationModal = false;
        $scope.openLocationModalAction = function(item) {
            $scope.openLocationModal = true;
            $scope.locationItem = item;
        };
        $scope.closeLocationModalAction = function() {
            $scope.openLocationModal = false;
        };
        var L = window.L;
        var map = new L.Map('map').setView([41.8914184, -87.6116459], 11);
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', {
            attribution: 'Positron'
        }).addTo(map);
        var redMarker = new L.Icon({
            iconSize: [20, 32],
            iconAnchor: [13, 27],
            popupAnchor: [13, -30],
            iconUrl: '../images/marker.png',
            iconRetinaUrl: '../images/marker2x.png',
        });
        DataService.fetchData().then(function(data) {
            $scope.data = data.data.feed.entry;
            for (var i = 0; i < $scope.data.length; i++) {
                L.marker([$scope.data[i].gsx$latitude.$t, $scope.data[i].gsx$longitude.$t], { icon: redMarker }).addTo(map).bindPopup('<div class="marker-popup-content"><div class="marker-popup-info"><h2>'+$scope.data[i].gsx$name.$t+'</h2><p>'+$scope.data[i].gsx$address.$t+'</p><button>Book a ride!</button></div><div class="marker-popupimage"><img src="https://editorial-chi.dnainfo.com/interactives/entertainment/img/'+$scope.data[i].gsx$image.$t+'" /></div></div>');
                console.log(i, 'TIMES');
            }
        }, function(err) {
            console.log('There was an error: ' + err);
        });
    });
