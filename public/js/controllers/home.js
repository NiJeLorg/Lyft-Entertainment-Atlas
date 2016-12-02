'use strict';
angular.module('entertainmentAtlas')
    .controller('HomeCtrl', function($scope, DataService, $sce, $parse, $window) {
        $scope.filterType = 'all';
        $scope.selectedLocation = {};
        $scope.setFilterType = function(type) {
            $scope.filterType = type;
        };
        $scope.filterByVenueType = function(item) {
            if ($scope.filterType === 'theater') {
                if (item.gsx$theater.$t === 'Yes') {
                    return true;
                }
            } else if ($scope.filterType === 'music') {
                if (item.gsx$music.$t === 'Yes') {
                    return true;
                }
            } else {
                return true;
            }
        };
        $scope.selectLocation = function(location) {
            $scope.selectedLocation = location;
        };
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
        $scope.orderLyft = function() {
            var url = 'lyft://ridetype?id=lyft&pickup[latitude]=37.764728&pickup[longitude]=-122.422999&destination[latitude]=37.7763592&destination[longitude]=-122.4242038';
            $window.location = url;
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
            var marker, lat, lng, latNorth, latSouth, lngEast, lngWest, corner1, corner2, bounds, paddingBottomRight;
            for (var i = 0; i < $scope.data.length; i++) {
                var imagesUrl = 'https://editorial-chi.dnainfo.com/interactives/entertainment/img/';
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
                        lat = e.target._latlng.lat;
                        lng = e.target._latlng.lng;
                        latNorth = lat + 0.01;
                        latSouth = lat - 0.01;
                        lngEast = lng + 0.01;
                        lngWest = lng - 0.01;
                        corner1 = L.latLng(latNorth, lngEast),
                        corner2 = L.latLng(latSouth, lngWest),
                        bounds = L.latLngBounds(corner1, corner2);
                        // TO DO: If at mobile screen widths, set paddingBottomRight = [0, 0]
                        paddingBottomRight = [600, 0];
                        map.flyToBounds(bounds, {
                            animate: true,
                            duration: 2,
                            paddingBottomRight: paddingBottomRight, 
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
