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
            // scroll navigation to the far left on mobile
            if ($('body').width() < 768) {
                $('.location-panel').animate({scrollLeft: $('.grid-list').offset().left}, 800);
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
            $scope.openLocationModal = true;
            $scope.locationItem = item;
            if ($('body').width() >= 768) {
                // hide grid list
                $('.grid-list').addClass('hidden');
            }
        };
        $scope.closeLocationModalAction = function() {
            $scope.openLocationModal = false;
            if ($('body').width() >= 768) {
                // unhide grid list
                $('.grid-list').removeClass('hidden');
            }
        };
        $scope.openLocationPopup = function(location) {
            var leafletId = location.gsx$id.$t;
            for (var key in map._layers) {
                if (map._layers[key]._leaflet_id === leafletId) {
                    map._layers[key].fire('click');
                }
            }
        };
        var openLyftPriceEstimateModal = function() {
            // open the modal for price estimates
            $('#bookARide').modal('show');
            // populate
            $('#toInput').attr('placeholder', $scope.selectedLocation.gsx$address.$t);
        };

        $scope.orderLyft = function() {
            if ($('body').width() < 768) {
                var url = 'lyft://ridetype?id=lyft&partner=4ujGa8RbFc5n&destination[latitude]=' + $scope.selectedLocation.gsx$latitude.$t + '&destination[longitude]=' + $scope.selectedLocation.gsx$longitude.$t;
                var iphoneurl = 'https://qa-visualizations.dnainfo.com/lyft_test/?lat=' + $scope.selectedLocation.gsx$latitude.$t + '&lng=' + $scope.selectedLocation.gsx$longitude.$t;
                if (!navigator.userAgent.toLowerCase().indexOf("iphone")) {
                    deeplink.open(url);
                } else {
                    try {
                        window.open(iphoneurl, '_blank');
                    } catch (e) {
                        window.open('https://itunes.apple.com/us/app/lyft-on-demand-ridesharing/id529379082?mt=8', '_blank');
                    }
                }

            } else {
                openLyftPriceEstimateModal();
            }
        };

        var L = window.L;
        var map = new L.Map('map');
        if ($('body').width() >= 768) {
            map.setView([41.897022, -87.609100], 13);
        } else {
            map.setView([41.924688, -87.648754], 11);
        }
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(map);
        var redMarker = new L.Icon({
            iconSize: [20, 32],
            iconAnchor: [13, 27],
            popupAnchor: [13, -30],
            iconUrl: '../images/marker.png',
            iconRetinaUrl: '../images/marker2x.png',
        });

        // set up deeplinking checks
        var deeplink = window.deeplink;
        deeplink.setup({
            iOS: {
                appName: "lyft-on-demand-ridesharing",
                appId: "529379082",
            },
            android: {
                appId: "me.lyft.android"
            }
        });

        DataService.connectToLyft();

        DataService.fetchData().then(function(data) {
            $scope.data = data.data.feed.entry;
            var featureGroup = L.featureGroup();
            var marker, lat, lng, latNorth, latSouth, lngEast, lngWest, corner1, corner2, bounds, paddingBottomRight, item;
            for (var i = 0; i < $scope.data.length; i++) {
                var imagesUrl = 'https://editorial-chi.dnainfo.com/interactives/entertainment/img/';
                var lyftButton, lyftUrl;
                if ($('body').width() < 768) {
                    lyftUrl = 'lyft://ridetype?id=lyft&partner=4ujGa8RbFc5n&destination[latitude]=' + $scope.data[i].gsx$latitude.$t + '&destination[longitude]=' + $scope.data[i].gsx$longitude.$t;
                    lyftButton = '<a href="#" class="book-a-ride marker bookARideMapButtonMobile" data-url="'+lyftUrl+'">Book a ride!</a>';
                } else {
                    lyftButton = '<a href="#" class="book-a-ride marker bookARideMapButton" data-id="' + i + '">Book a ride!</a>';
                }

                var popInfo = '<div class="popupInfo">' +
                    '<div class="popupInfo-location">' +
                    '<h5 class="open-modal" data-id="' + i + '">' + $scope.data[i].gsx$name.$t + '</h5>' +
                    '<p>' + $scope.data[i].gsx$address.$t + '</p>' +
                    lyftButton +
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
                        latNorth = lat + 0.02;
                        latSouth = lat - 0.02;
                        lngEast = lng + 0.02;
                        lngWest = lng - 0.02;
                        corner1 = L.latLng(latNorth, lngEast),
                        corner2 = L.latLng(latSouth, lngWest),
                        bounds = L.latLngBounds(corner1, corner2);
                        if ($('body').width() >= 768) {
                            paddingBottomRight = [700, 0];
                        } else {
                            paddingBottomRight = [150, 0];
                        }
                        map.flyToBounds(bounds, {
                            animate: true,
                            duration: 1,
                            easeLinearity: 0.5,
                            paddingBottomRight: paddingBottomRight,
                        });
                        // load modal on click if not mobile width
                        if ($('body').width() >= 768) {
                            item = $scope.data[e.target.options.alt];
                            $scope.$apply(function() {
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
        $(document).on('click', '.open-modal', function() {
            var item = $scope.data[this.dataset.id];
            $scope.$apply(function() {
                $scope.selectLocation(item);
                $scope.openLocationModalAction(item);
            });
        });

        $(document).on('click', '.bookARideMapButtonMobile', function() {
            deeplink.open(this.dataset.url);
        });

        $(document).on('click', '.bookARideMapButton', function() {
            var item = $scope.data[this.dataset.id];
            $scope.$apply(function() {
                $scope.selectLocation(item);
                openLyftPriceEstimateModal();
            });
        });

        $(document).on('click', '#getEstimate', function(e) {
            e.preventDefault();
            $('.price-estimate').addClass('hidden');
            $('.bad-address').addClass('hidden');            
            $scope.$apply(function () {
                DataService.getRideEstimate($scope.selectedLocation.gsx$latitude.$t, $scope.selectedLocation.gsx$longitude.$t).then(function(cost) {
                    if (cost.data.cost_estimates[0].can_request_ride) {
                        $('.bad-address').addClass('hidden');
                        var min_cost = (cost.data.cost_estimates[0].estimated_cost_cents_min / 100).toFixed(2);
                        var max_cost = (cost.data.cost_estimates[0].estimated_cost_cents_max / 100).toFixed(2);
                        $('.min-price').text('$' + min_cost);
                        $('.max-price').text('$' + max_cost);
                        $('.price-estimate').removeClass('hidden');                        
                    } else {
                        $('.price-estimate').addClass('hidden');
                        $('.bad-address').removeClass('hidden'); 
                    }
                });
            });
        });

        $('#bookARide').on('hidden.bs.modal', function (e) {
            $('.price-estimate').addClass('hidden');
            $('.bad-address').addClass('hidden');
        })
    });
