'use strict';
angular.module('entertainmentAtlas')
    .controller('HomeCtrl', function($scope, DataService, $sce, $parse) {
        $scope.openLocationModal = false;
        $scope.openLocationModalAction = function(item) {
            $scope.openLocationModal = true;
            $scope.locationItem = item;
        };
        $scope.closeLocationModalAction = function() {
            $scope.openLocationModal = false;
        };
        $scope.openLocationPopup = function(location) {
            var leafletId = location.gsx$id.$t;
            for (var key in map._layers) {
                if (map._layers[key]._leaflet_id === leafletId) {
                    map._layers[key].fire('click');
                }
            }
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

        DataService.connectToLyft();

        DataService.fetchData().then(function(data) {
            $scope.data = data.data.feed.entry;
            var featureGroup = L.featureGroup();
            var marker;
            for (var i = 0; i < $scope.data.length; i++) {
                var imagesUrl = 'https://editorial-chi.dnainfo.com/interactives/entertainment/img/';
                var lat = $scope.data[i].gsx$latitude.$t;
                var long = $scope.data[i].gsx$longitude.$t;
                var popInfo = '<div class="popupInfo">' +
                    '<div class="popupInfo-location">' +
                    '<h5>' + $scope.data[i].gsx$name.$t + '</h5>' +
                    '<p>' + $scope.data[i].gsx$address.$t + '</p>' +
                    '<button class="book-a-ride">' + 'Book a ride!' + '</button>' +
                    '</div>' +
                    '<div class="popupInfo-image">' +
                    '<img src="' + imagesUrl + $scope.data[i].gsx$image.$t + '" class="marker-image">' +
                    '</div>' +
                    '</div>';
                marker = L.marker([$scope.data[i].gsx$latitude.$t, $scope.data[i].gsx$longitude.$t], { icon: redMarker, title: $scope.data[i].gsx$id.$t })
                    .addTo(map)
                    .bindPopup(popInfo)
                    .on('click', function(e) {
                        console.log(e, 'E');
                        map.flyTo([e.target._latlng.lat, e.target._latlng.lng], 15, {
                            animate: true,
                            duration: 2
                        });
                    });
                featureGroup.addLayer(marker);
            }
            featureGroup.eachLayer(function(layer) {
                layer._leaflet_id = layer.options.title;
            });
        }, function(err) {
            console.log('There was an error: ' + err);
        });
    });
