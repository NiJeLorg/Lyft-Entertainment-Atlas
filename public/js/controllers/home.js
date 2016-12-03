'use strict';
angular.module('entertainmentAtlas')
    .controller('HomeCtrl', function($scope, DataService, $sce, $parse, $window) {
        $scope.filterType = 'all';
        $scope.selectedLocation = {};
        $scope.setFilterType = function(type) {
            $scope.filterType = type;
            if ($('.all-venues').hasClass('active')) {
                $('.all-venues').removeClass('active');
            }
            if ($('.music-venues').hasClass('active')) {
                $('.music-venues').removeClass('active');
            }
            if ($('.theater-venues').hasClass('active')) {
                $('.theater-venues').removeClass('active');
            }
            if (type === 'all') {
                $('.all-venues').addClass('active');
            }
            if (type === 'music') {
                $('.music-venues').addClass('active');
            }
            if (type === 'theater') {
                $('.theater-venues').addClass('active');
            }
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
            console.log(item);
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
        var redirectStores = function() {
            if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
                window.location.href = 'https://play.google.com/store/apps/details?id=me.lyft.android';
            } else if (navigator.userAgent.toLowerCase().indexOf("iphone") > -1) {
                window.location.href = 'https://itunes.apple.com/us/app/lyft-on-demand-ridesharing/id529379082?mt=8';
            } else {
                window.location.href = 'https://www.lyft.com/';
            }
        };
        $scope.orderLyft = function() {
            if (Modernizr.touch){
                var url = 'lyft://ridetype?id=lyft&destination[latitude]=' + $scope.selectedLocation.gsx$latitude.$t + '&destination[longitude]=' + $scope.selectedLocation.gsx$longitude.$t;
                try {
                    window.open(url, '_blank');
                } catch (e) {
                    console.log(e);
                    redirectStores();
                }
            } else {
                window.open('https://www.lyft.com/', '_blank');
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
            var marker, lat, lng, latNorth, latSouth, lngEast, lngWest, corner1, corner2, bounds, paddingBottomRight, item;
            for (var i = 0; i < $scope.data.length; i++) {
                var imagesUrl = 'https://editorial-chi.dnainfo.com/interactives/entertainment/img/';
                var lyftUrl;
                if (Modernizr.touch){
                    var lyftUrl = 'lyft://ridetype?id=lyft&destination[latitude]=' + $scope.data[i].gsx$latitude.$t + '&destination[longitude]=' + $scope.data[i].gsx$longitude.$t;
                } else {
                    var lyftUrl = 'https://www.lyft.com/';
                }
                var popInfo = '<div class="popupInfo">' +
                    '<div class="popupInfo-location">' +
                    '<h5 class="open-modal" data-id="' + i + '">' + $scope.data[i].gsx$name.$t + '</h5>' +
                    '<p>' + $scope.data[i].gsx$address.$t + '</p>' +
                    '<a href="' + lyftUrl + '" class="book-a-ride marker" target="_blank">Book a ride!</a>' +
                    '</div>' +
                    '<div class="popupInfo-image open-modal" data-id="' + i + '">' +
                    '<img src="' + imagesUrl + $scope.data[i].gsx$image.$t + '" class="marker-image">' +
                    '</div>' +
                    '</div>';
                marker = L.marker([$scope.data[i].gsx$latitude.$t, $scope.data[i].gsx$longitude.$t], { icon: redMarker, title: $scope.data[i].gsx$id.$t, alt: i })
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
                        // At mobile screen widths, set paddingBottomRight = [0, 0]
                        if ($('body').width() > 1024) {
                            paddingBottomRight = [600, 0];
                        } else if ($('body').width() > 768) {
                            paddingBottomRight = [500, 0];
                        } else {
                            paddingBottomRight = [200, 0];
                        }
                        map.flyToBounds(bounds, {
                            animate: true,
                            duration: 2,
                            paddingBottomRight: paddingBottomRight,
                        });
                        // load modal on click if not mobile width
                        if ($('body').width() > 768) { 
                            item = $scope.data[e.target.options.alt];
                            $scope.$apply(function () {
                                $scope.selectLocation(item);
                                $scope.openLocationModalAction(item);
                            });
                        }

                    });
                featureGroup.addLayer(marker);
            }
            featureGroup.eachLayer(function(layer) {
                layer._leaflet_id = layer.options.title;
            });
        }, function(err) {
            console.log('There was an error: ' + err);
        });

        // attach listener to title and image in popup that launches modal
        $(document).on('click', '.open-modal', function(e) {
            console.log(e);
            item = $scope.data[e.data.id];
            $scope.$apply(function () {
                $scope.selectLocation(item);
                $scope.openLocationModalAction(item);
            });
        });

    });
