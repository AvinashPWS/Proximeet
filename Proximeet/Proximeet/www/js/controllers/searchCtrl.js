angular.module('ionicApp.searchCtrl', ['ngAnimate'])
        .controller('searchCtrl', function (shareDetail, $scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state
                , $ionicLoading, $filter, cardService, Crud, latlong, postList, $ionicActionSheet, $ionicBackdrop, $timeout, addressService, chatData) {
            //$scope.name = $state.current.name;
            //$ionicHistory.clearCache();
            //$ionicHistory.clearHistory();
            //$ionicPlatform.registerBackButtonAction(function () {
            //    if (!userLogin.isLoggedIn) {
            //        $state.go('green.login');
            //        $ionicHistory.clearHistory();
            //        navigator.app.clearHistory();
            //        $ionicHistory.clearCache();
            //        $ionicHistory.clearHistory();
            //        $ionicHistory.nextViewOptions({
            //            disableBack: true
            //        });
            //    }
            //    else {
            //        navigator.app.clearHistory();
            //        $ionicHistory.clearCache();
            //        $ionicHistory.clearHistory();
            //        $ionicPopup.confirm({
            //            title: "Exiting app",
            //            template: 'Are you sure you want to Exit?'
            //        }).then(function (res) {
            //            if (res) {
            //                navigator.app.exitApp();
            //            }
            //            else {
            //                navigator.app.clearHistory();
            //                $ionicHistory.clearCache();
            //                $ionicHistory.clearHistory();
            //            }
            //        })
            //    }
            //
            //
            //}, 100);

            //$scope.$on('$ionicView.afterEnter', function() {
            //    console.log('beforeEnter');
            //    //$state.transitionTo('green.search');
            //    google.maps.event.trigger(map, 'resize');
            //});

            /*function getDistance(){
             if(){
             console.log("yes its there")
             return parseFloat(sessionStorage['radius'])
             }else{
             return 1
             }
             }*/

            localStorage.isIntroOver = true;

            $scope.loggedInUser = userLogin.user_id;

            $scope.AdminID = localStorage.AdminID;

            var clear_Map;
            var mapDiv;
            var map;

            $scope.gotoHelp = function () {

                $timeout(function () {
                    $ionicSideMenuDelegate.canDragContent(true);
                    localStorage.isIntroOver = true;
                }, 10);

                $state.go('green.help');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    disableAnimate: true,
                    historyRoot: true
                });
            };
            
            $scope.toggleDefaultCard = function (sCard){
                if(sCard.title.toUpperCase() === 'DEFAULT CARD' && $scope.loggedInUser === $scope.AdminID){
                    return false;
                }
                return $scope.showCrads;
            }

            $scope.getBackGroundClass = function (sCard) {
                if (sCard.detail_obj.Post.provider_id === userLogin.user_id) {
                    return "myCard";
                } else {
                    return "othersCard";
                }
            };

            $scope.wantToChatWithAdmin = function () {

                if (userLogin.isLoggedIn) {
                    if (localStorage.email_verify == "1") {

                        //Dont change any key and value

                        chatData.setChatObj({
                            "To": localStorage.AdminID,
                            "subscriber_id": userLogin.user_id,
                            "provider_id": localStorage.AdminID,
                            "post_id": "",
                            "user_id": localStorage.user_id,
                            "app_id": "1",
                            "flag": 0,
                            "provider_name": "Admin",
                            "subscriber_name": "Me",
                            "AdminChat": true
                        });

                        console.log("the chat obj", chatData.getChatObj())

                        $state.go("green.chat");
                    }
                    //todo
                    else {
                        $ionicPopup.alert({
                            title: 'Alert!',
                            content: "your email is not yet verified, if verified please re-login otherwise click 'ok' to resend verification link"
                        }).then(function (res) {
                            Crud.create({
                                root: "users/resend_emailverify_link.json"
                            }, {"user_id": localStorage.user_id}, function (response) {
                                if (response.status) {
                                    $ionicPopup.alert({
                                        title: 'Success',
                                        content: "Please check your email or in spam for verification link"
                                    }).then(function (res) {

                                    });
                                }
                            });
                        });
                    }

                } else {
                    $ionicPopup.alert({
                        title: "Alert!",
                        content: "Please login to continue"
                    }).then(function (res) {
                        if (res) {


                            $state.go('green.login');
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({
                                disableBack: true,
                                disableAnimate: true,
                                historyRoot: true
                            });
                        } else {


                            $state.go('green.login');
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({
                                disableBack: true,
                                disableAnimate: true,
                                historyRoot: true
                            });
                        }

                    });

                }
            };

            $scope.gotoMenuThree = function () {
                $state.go('green.threeMenu');
            }


            $scope.isCacheable = userLogin.isLoggedIn;

            cardService.data.cardFlag = 0;

            $scope.isFilterThere = function () {
                return true;
            }

            $scope.$watch("data.searchCategory", function (a, b) {
                if (a) {
                    $scope.showFilterText = true;
                    $scope.filterText = a;
                } else {
                    $scope.showFilterText = false;
                    $scope.filterText = "";
                }
            });

            $scope.gotoListSearch = function () {
                $state.go('green.list');
                $ionicHistory.nextViewOptions({
                    disableBack: false
                });
            };


            $scope.gotoUserAdProfile = function (obj) {
                //console.log("get post id",obj.User.user_id);
                $state.go('green.userAdProfile', {user_id: obj.User.user_id});
                $ionicHistory.nextViewOptions({
                    disableBack: false,
                    disableAnimate: true
                });
            };



            $scope.isOwnerCard = function (id) {
                //self.color
                //console.log("is user owner-->",id)
                if (id == userLogin.user_id) {
                    return "externalUserCard";

                } else {
                    return "loggedInUserCard";
                }
            };

            $scope.gotoDetail = function (obj) {
                shareDetail.postDetail = obj;
                $state.go('green.detail', {post_id: obj.Post.post_id});
                $ionicHistory.nextViewOptions({
                    disableBack: false,
                    disableAnimate: true
                });
            };


            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            var deregister = $ionicPlatform.registerBackButtonAction(function () {

                if (!userLogin.isLoggedIn) {
                    if ($state.current.name == "green.search") {
                        navigator.app.clearHistory();
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $state.go('green.login');

                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            disableAnimate: true
                        });
                    }
                    //else{
                    //    $state.go('green.search');
                    //    $ionicHistory.clearHistory();
                    //    navigator.app.clearHistory();
                    //    $ionicHistory.clearCache();
                    //    $ionicHistory.clearHistory();
                    //    $ionicHistory.nextViewOptions({
                    //        disableBack: true
                    //    });
                    //}

                } else {
                    if ($state.current.name == "green.search") {
                        $ionicPopup.confirm({
                            title: "Exiting app",
                            template: 'Are you sure you want to Exit?'
                        }).then(function (res) {
                            if (res) {
                                navigator.app.exitApp();
                            } else {
                                navigator.app.clearHistory();
                                $ionicHistory.clearCache();
                                $ionicHistory.clearHistory();
                            }
                        })
                    }
                }


            }, 100);

            $scope.$on('$destroy', deregister);


            $scope.data = {};






            var geocoder = new google.maps.Geocoder();

            $scope.$watch('data.searchAddress', function (query) {
                $scope.recentaddressShow = false;
                $scope.changeaddressShow = false;
                if (query == "") {
                    $scope.locations = undefined;
                    $scope.data.location = undefined;
                    $scope.data.searchAddress = undefined;
                    $scope.changeaddressShow = false;
                } else {
                    $scope.changeaddressShow = true;
                }
                if (!query) {
                    $scope.recentaddressShow = true;
                }
                var request = {
                    address: query,
                    componentRestrictions: {
                        country: 'INDIA'
                    }
                }

                geocoder.geocode(request, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log(results);
                        $scope.$apply(function () {
                            $scope.locations = results;
                            //console.log($scope.locations);
                        });
                    } else {
                        // @TODO: Figure out what to do when the geocoding fails
                    }
                });
            }, true);

            $scope.recentlyAddArr = [];

            $scope.clearRecent = function () {
                if (localStorage.hasOwnProperty("recent") === true && localStorage.recent != '') {
                    localStorage.recent = '';
                    $scope.recentlyAddArr = [];
                }

            };

            $scope.filterObj = {};
            $scope.selectLocation = function (addressObj) {
                $scope.filterObj.addressObj = {};
                document.activeElement.blur();

                if (localStorage.hasOwnProperty("recent") === true && localStorage.recent != '') {
                    $scope.recentlyAddArr = JSON.parse(localStorage['recent'])
                }
                if ($scope.recentlyAddArr.length) {
                    var canUnShift = true;
                    for (addindex in $scope.recentlyAddArr) {
                        if (addressObj.formatted_address == $scope.recentlyAddArr[addindex].formatted_address) {
                            canUnShift = false;
                        }
                    }
                    if (canUnShift) {
                        $scope.recentlyAddArr.unshift(addressObj);
                    }
                } else {
                    $scope.recentlyAddArr.unshift(addressObj);
                }

                $scope.recentlyAddArr = $scope.recentlyAddArr.splice(0, 3);
                localStorage['recent'] = JSON.stringify($scope.recentlyAddArr);
                console.log("arrrecent", $scope.recentlyAddArr);
                $scope.recentaddressShow = true;
                $scope.data.location = addressObj.formatted_address;
                $scope.data.formatted_address = addressObj.formatted_address;

                console.log($scope.data.location);
                lati = undefined;
                lon = undefined;
                $scope.data.latlon = undefined;

                //console.log($scope.data.searchCategory);
                //console.log(addressObj);

                $scope.data.searchAddress = addressObj.formatted_address;
                $scope.filterObj.addressObj = addressObj;
                $scope.locations = undefined;
                console.log($scope.filterObj);



                /*      $scope.addressmodal.hide();
                 $scope.addressmodal.remove();
                 google.maps.event.trigger(map, 'resize');
                 setTimeout(function () {
                 $scope.addressChanged(addressObj);
                 },500)*/
            };


            $scope.applyFilter = function () {
                $scope.filterObj.category = $scope.data.searchCategory;
                console.log($scope.filterObj);
                $scope.data.searchStr = $scope.filterObj.category;
                if (!$scope.filterObj.addressObj) {
                    $scope.addressmodal.hide();
                    $scope.addressmodal.remove();
                    makePostCall();
                    return;
                }



                sessionStorage.category = $scope.filterObj.category;
                $scope.addressmodal.hide();
                $scope.addressmodal.remove();
                google.maps.event.trigger(map, 'resize');

                setTimeout(function () {
                    $scope.addressChanged($scope.filterObj.addressObj);
                }, 500);

            }

            $scope.getLocationAddress = function () {

                if (localStorage.hasOwnProperty("recent") === true && localStorage.recent != '') {
                    $scope.recentlyAddArr = JSON.parse(localStorage['recent'])
                }

                $scope.data.searchAddress = undefined;
                if ($scope.data.location) {
                    $scope.data.formatted_address = $scope.data.location;
                }

                $ionicModal.fromTemplateUrl('changeAddress.html', {
                    scope: $scope,
                    animation: 'scale-in'
                }).then(function (modal) {
                    $scope.addressmodal = modal;
                    modal.show();
                    console.log(sessionStorage.category);
                    $scope.data.searchCategory = ($scope.data.searchStr) ? $scope.data.searchStr : "";
                    $timeout(function () {
                        document.getElementById("address_field").focus();
                    }, 500)

                });

                $scope.goBacktoSearch = function () {
                    document.getElementById("address_field").blur();
                    $timeout(function () {
                        $scope.addressmodal.hide();
                        $scope.addressmodal.remove();
                    }, 500)

                }

                $scope.clearAddressField = function () {
                    $scope.data.searchAddress = undefined;
                }
                $scope.clearCategoryField = function () {
                    $scope.data.searchCategory = "";
                };


                $scope.closeAddressModal = function () {
                    $scope.locations = undefined;
                    $scope.data.searchAddress = undefined;
                    $scope.data.formatted_address = undefined;
                    $scope.data.location = undefined;
                    $scope.addressmodal.hide();
                    $scope.addressmodal.remove();
                    lati = undefined;
                    lon = undefined;
                    $scope.data.latlon = undefined;
                };


                $ionicPlatform.on('backbutton', function (e) {
                    $scope.addressmodal.hide();
                    $scope.addressmodal.remove();
                });

            };







            $scope.$watch('data.userSelectedDate', function (unformattedDate) {
                $scope.data.formattedDateSearch = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm');
                $scope.data.userSelectedDate = $scope.data.formattedDateSearch;
            });
            $scope.openDatePickerSearch = function () {
                $scope.tmp = {};
                $scope.tmp.newDate = $scope.data.userSelectedDate;

                var DatePopup = $ionicPopup.show({
                    template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
                    title: "Pick Date and Time",
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel',
                            onTap: function (e) {
                                $scope.data.userSelectedDate = undefined;
                            }},
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                $scope.data.userSelectedDate = $scope.tmp.newDate;
                            }
                        }
                    ]
                });
            }


            $scope.$on('$destroy', function () {
                map.destroy();
            });




            $ionicModal.fromTemplateUrl('searchOption.html', {
                scope: $scope,
                animation: 'fade-in'
            }).then(function (modal) {
                $scope.modalOption = modal
            });

            $scope.openOptionModal = function () {

                $scope.modalOption.show();
                $scope.showbackdrop = false;

                $timeout(function () {
                    $scope.showbackdrop = true;
                    console.log($scope.showbackdrop);
                }, 600)


            };

            $scope.closeOptionModal = function () {
                //console.log(lat + " " + lon);
                $scope.modalOption.hide();

            };

            $scope.$on('$destroy', function () {
                $scope.modalOption.remove();
            });


            $scope.posedLists = "No Post So Far";

            $ionicModal.fromTemplateUrl('listOfPosts.html', {
                scope: $scope,
                animation: 'scale-in'
            }).then(function (modal) {
                $scope.modallist = modal
            });

            $scope.openListModel = function () {
                $scope.posedLists = postList.listOfPostsArr;
                $scope.modallist.show();

            }

            $scope.closeListModel = function () {

                $scope.modallist.hide();
            };

            $scope.$on('$destroy', function () {
                $scope.modallist.remove();
            });


            var getPoint;
            var currPos = undefined;
            var currPosArr = [];
            var initPos = {};
            var oldAddress = "";
            var bounds = new google.maps.LatLngBounds();
            $scope.addressFromMap = undefined;
            $scope.currRad = 1 + " Kms";

            $scope.showCrads = true;

            function updateRad(data) {
                if (data < 1) {
                    $scope.currRad = (data * 1000).toFixed(2) + " mt";
                } else {
                    $scope.currRad = data.toFixed(2) + " Kms";
                }
            }


            function DistanceWidget(map) {


                google.maps.event.addListener(map, 'dragstart', function () {
                    console.log("dragging start");
                    $scope.$apply(function () {
                        $scope.showCrads = false;
                        $scope.showCardStack = false;
                    })

                });
                google.maps.event.addListener(map, 'dragend', function () {
                    console.log("dragging map end");
                    $scope.$apply(function () {
                        $scope.showCrads = true;
                        if ($scope.resultArrLen >= 2) {
                            $scope.showCardStack = true;
                        }
                    })

                });

                this.set('map', map);
                this.set('position', map.getCenter());

                var iconMark = 'img/locate.png';
                var marker = new google.maps.Marker({
                    draggable: true,
                    title: 'Move me!',
                    icon: iconMark
                });

                google.maps.event.addListener(marker, "dragstart", function (event) {
                    console.log("dragging start");
                    $scope.$apply(function () {
                        $scope.showCrads = false;
                        $scope.showCardStack = false;
                    })
                })

                google.maps.event.addListener(marker, "dragend", function (event) {
                    google.maps.event.trigger(map, 'resize');
                    var point = marker.getPosition();
                    console.log(point)
                    getPoint = point;

                    map.panTo(point);


                    var loc = new google.maps.LatLng(point.G, point.K);
                    bounds.extend(loc);



                    makePostCall();
                    $scope.$apply(function () {
                        $scope.showCrads = true;
                        if ($scope.resultArrLen >= 2) {
                            $scope.showCardStack = true;
                        }
                    })


                });


                marker.bindTo('map', this);

                marker.bindTo('position', this);

                var radiusWidget = new RadiusWidget();


                radiusWidget.bindTo('map', this);


                radiusWidget.bindTo('center', this, 'position');


                this.bindTo('distance', radiusWidget);


                this.bindTo('bounds', radiusWidget);
            }

            DistanceWidget.prototype = new google.maps.MVCObject();

            var draggerPos;

            function RadiusWidget() {
                var circle = new google.maps.Circle({
                    strokeWeight: 2,
                    strokeColor: '#f80',
                    strokeOpacity: '0.9',
                    fillColor: '#f80',
                    fillOpacity: '0.1'
                });


                this.set('distance', (sessionStorage.hasOwnProperty("radius") === true) ? (eval(sessionStorage['radius'])) : 1);


                this.bindTo('bounds', circle);

                circle.bindTo('center', this);
                circle.bindTo('map', this);


                circle.bindTo('radius', this);


                this.addSizer_();
            }

            RadiusWidget.prototype = new google.maps.MVCObject();


            RadiusWidget.prototype.distance_changed = function () {
                this.set('radius', this.get('distance') * 1000);
            };

            var iconBase = 'img/drag.png';
            RadiusWidget.prototype.addSizer_ = function () {
                var sizer = new google.maps.Marker({
                    draggable: true,
                    title: 'Drag me!',
                    icon: iconBase
                });
                sizer.bindTo('map', this);
                sizer.bindTo('position', this, 'sizer_position');


                var me = this;
                google.maps.event.addListener(sizer, 'drag', function () {

                    me.setDistance();
                });

                google.maps.event.addListener(sizer, 'dragstart', function () {

                    console.log("dragging start");
                    $scope.$apply(function () {
                        $scope.showCrads = false;
                        $scope.showCardStack = false;
                    })

                });

                google.maps.event.addListener(sizer, 'dragend', function () {
                    //var boun
                    console.log("drag_pos---->", draggerPos);
                    console.log("drag_pos lat lng---->", draggerPos.lat(), draggerPos.lng());

                    google.maps.event.trigger(map, 'resize');

                    var loc = new google.maps.LatLng(draggerPos.lat(), draggerPos.lng());
                    bounds.extend(loc);


                    makePostCall();
                    $scope.$apply(function () {
                        $scope.showCrads = true;
                        if ($scope.resultArrLen >= 2) {
                            $scope.showCardStack = true;
                        }
                    })

                });
            };


            RadiusWidget.prototype.center_changed = function () {
                var bounds = this.get('bounds');


                if (bounds) {
                    var lng = bounds.getNorthEast().lng();


                    var position = new google.maps.LatLng(this.get('center').lat(), lng);
                    this.set('sizer_position', position);
                }
            };


            RadiusWidget.prototype.distanceBetweenPoints_ = function (p1, p2) {
                if (!p1 || !p2) {
                    return 0;
                }

                var R = 6371; // Radius of the Earth in km
                var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
                var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                return d;
            };

            RadiusWidget.prototype.setDistance = function () {

                var pos = this.get('sizer_position');
                var center = this.get('center');
                var distance = this.distanceBetweenPoints_(center, pos);
                console.log("pos--->", pos)
                draggerPos = pos;
                this.set('distance', distance);
            };



            var styles = [
                {
                    stylers: [
                        {hue: "#f4e7da"},
                        {saturation: -20}
                    ]
                }, {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        {lightness: 50},
                        {visibility: "simplified"}
                    ]
                }, {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [
                        {visibility: "off"}
                    ]
                }
            ];
            var styledMap = new google.maps.StyledMapType(styles,
                    {name: "Styled Map"});




            $scope.callInit = function () {
                currPos = undefined;
                cardService.data.cardFlag = 0;
                $scope.cards = [];
                $scope.value = 0;
                postList.listOfPostsArr = "";
                cardService.data.resArr = [];

                mapDiv = document.getElementById('map-canvas');

                map = new google.maps.Map(mapDiv, {
                    //zoom: (sessionStorage.hasOwnProperty("zoom")=== true)?(eval(sessionStorage['zoom'])):14,
                    zoom: 14,
                    panControl: false,
                    zoomControl: false,
                    scaleControl: true,
                    overviewMapControl: true,
                    disableDefaultUI: true,
                    streetViewControl: false,
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style'],
                    enableHighAccuracy: true
                });

                map.addListener('zoom_changed', function () {
                    $scope.mapZoom = map.getZoom();
                });




                google.maps.event.trigger(map, 'resize');

                map.mapTypes.set('map_style', styledMap);
                map.setMapTypeId('map_style');

                $scope.$on('$ionicView.enter', function () {
                    console.log('beforeEnter');
                    $scope.showCardStack = false;
                    //$state.transitionTo('green.search');
                    if (sessionStorage.hasOwnProperty("category")) {
                        $scope.data.searchStr = (sessionStorage.category != "undefined" || sessionStorage.category != "" || sessionStorage.category != undefined) ? sessionStorage.category : "";
                    }

                    google.maps.event.trigger(map, 'resize');
                });

                $scope.$on('$ionicView.leave', function () {
                    console.log("before leave", sendSearch)
                    sessionStorage.lat = sendSearch.latitude;
                    sessionStorage.lon = sendSearch.longitude;
                    sessionStorage.radius = sendSearch.radius;
                    sessionStorage.zoom = $scope.mapZoom;
                    sessionStorage.category = $scope.filterText;

                });


                clear_Map = function () {
                    directionsDisplay = new google.maps.DirectionsRenderer();
                    ;
                    var myOptions = {
                        zoom: 14,
                        panControl: false,
                        zoomControl: false,
                        scaleControl: true,
                        overviewMapControl: true,
                        disableDefaultUI: true,
                        streetViewControl: false,
                        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style'],
                        enableHighAccuracy: true
                    };
                    google.maps.event.trigger(map, 'resize');

                    map = new google.maps.Map(mapDiv, myOptions);
                    directionsDisplay.setMap(map);

                    map.mapTypes.set('map_style', styledMap);
                    map.setMapTypeId('map_style');

                }

                $scope.addressChanged = function (change) {
                    console.log(change);
                    //console.log(change.formatted_address);

                    latlong.goGet(change.formatted_address, function (dataResponse) {
                        currPos = undefined;

                        var googleData = dataResponse;
                        var newAddress = googleData.results[0].formatted_address;
                        if (true) {
                            clear_Map();

                            map.setCenter(new google.maps.LatLng(googleData.results[0].geometry.location.lat, googleData.results[0].geometry.location.lng));
                            getPoint = new google.maps.LatLng(googleData.results[0].geometry.location.lat, googleData.results[0].geometry.location.lng);
                            initPos.latitude = googleData.results[0].geometry.location.lat;
                            initPos.longitude = googleData.results[0].geometry.location.lng;
                            initPos.radius = 1;


                            console.log(sendSearch)
                            makePostCall();


                            distanceWidget = new DistanceWidget(map);
                            google.maps.event.addListener(distanceWidget, 'distance_changed', function () {

                                currPos = distanceWidget;
                                var sampleArr = Object.keys(distanceWidget.position).map(function (key) {
                                    console.log("distlatlon--->", distanceWidget.position);
                                    return distanceWidget.position[key]
                                });
                                console.log("curr pos", sampleArr)
                                currPosArr = sampleArr;
                            });


                            google.maps.event.addListener(distanceWidget, 'position_changed', function () {

                                currPos = distanceWidget;
                                var sampleArr = Object.keys(distanceWidget.position).map(function (key) {
                                    console.log("posslatlon--->", distanceWidget.position)
                                    return distanceWidget.position[key]
                                });
                                console.log("curr pos", sampleArr)
                                currPosArr = sampleArr;

                            });

                            oldAddress = newAddress;


                        }

                    });
                };

                var nav_options = {maximumAge: 0, timeout: 10000, enableHighAccuracy: true};
                navigator.geolocation.getCurrentPosition(function (pos) {



                    var lat, lon, rad;

                    if (sessionStorage.lat && sessionStorage.lon && sessionStorage.radius) {
                        lat = eval(sessionStorage.lat);
                        lon = eval(sessionStorage.lon);
                        rad = sessionStorage.radius;
                        //sessionStorage.clear();
                        addressService.goGet(lat, lon, function (address) {
                            $scope.addressFromMap = address;
                            //$scope.data.searchAddress = address;
                        });
                    } else {
                        lat = pos.coords.latitude;
                        lon = pos.coords.longitude;
                        rad = 1;
                        addressService.goGet(lat, lon, function (address) {
                            $scope.addressFromMap = address;
                            //$scope.data.searchAddress = address;
                        });
                    }

                    map.setCenter(new google.maps.LatLng(lat, lon));
                    getPoint = new google.maps.LatLng(lat, lon);
                    initPos.latitude = lat;
                    initPos.longitude = lon;
                    initPos.radius = rad;

                    distanceWidget = new DistanceWidget(map);
                    google.maps.event.addListener(distanceWidget, 'distance_changed', function () {

                        currPos = distanceWidget;
                        var sampleArr = Object.keys(distanceWidget.position).map(function (key) {
                            return distanceWidget.position[key]
                        });
                        console.log("curr pos", sampleArr)
                        currPosArr = sampleArr;
                    });


                    google.maps.event.addListener(distanceWidget, 'position_changed', function () {

                        currPos = distanceWidget;
                        var sampleArr = Object.keys(distanceWidget.position).map(function (key) {
                            return distanceWidget.position[key]
                        });
                        console.log("curr pos", sampleArr)
                        currPosArr = sampleArr;
                    });
                    if (sessionStorage.hasOwnProperty("category")) {
                        console.log(typeof sessionStorage.category)
                        console.log(sessionStorage.category)

                        if (sessionStorage.category != "undefined" || sessionStorage.category != undefined != " " || sessionStorage.category != "") {
                            $scope.showFilterText = true;
                            $scope.filterText = sessionStorage.category;
                        } else {
                            $scope.showFilterText = false;
                            $scope.filterText = undefined;
                        }
                        if (sessionStorage.category === "") {
                            $scope.showFilterText = false;
                            $scope.filterText = "";
                        }
                    }
                    setTimeout(function () {
                        sessionStorage.clear();
                    }, 500)
                    console.log("make post call")
                    makePostCall();
                }, function () {
                    $ionicPopup.alert({
                        title: "GPS Error",
                        content: "Make sure whether the GPS is on"
                    }).then(function (res) {

                    });
                    cardService.data.cardFlag = 0;
                }, nav_options);


            };


            $scope.getMeNow = function () {
                //console.log("get me there"+map);
                map.panTo(getPoint);
            };

            var sendSearch = {};


            function getCurrDate() {
                if ($scope.data.userSelectedDate == undefined) {
                    var currentdate = moment().format("YYYY-MM-DD HH:mm:ss")


                    return currentdate;

                } else {
                    return $scope.data.userSelectedDate;
                }
            }


            function getSearchName() {
                if ($scope.data.searchStr == undefined) {
                    return "";
                } else {
                    return $scope.data.searchStr;
                }
                //return $scope.data.searchStr;
            }


            function  getUserId() {
                if (userLogin.isLoggedIn) {
                    return localStorage.user_id;
                } else {
                    return "";
                }
            }


            function getAlldataSearch() {
                if (currPos == undefined) {
                    if ($scope.data.name == undefined) {
                        //console.log("name not mentioned")
                    }

                    sendSearch.latitude = initPos.latitude;
                    sendSearch.longitude = initPos.longitude;
                    sendSearch.radius = initPos.radius;
                    sendSearch.date_time = getCurrDate();
                    sendSearch.name = getSearchName();
                    //console.log(sendSearch);
                    sendSearch.user_id = getUserId();
                } else {
                    sendSearch.latitude = currPosArr[0]();
                    sendSearch.longitude = currPosArr[1]();
                    sendSearch.radius = currPos.get('distance');
                    sendSearch.date_time = getCurrDate();
                    sendSearch.name = getSearchName();
                    sendSearch.user_id = getUserId();


                }
            }


            $scope.stickManMarkers = [];

            $scope.closeOptionModal = function () {
                if ($scope.data.formatted_address == undefined) {
                    currPos = undefined;
                    $scope.callInit();

                }
                getAlldataSearch();
                $scope.modalOption.hide();
                makePostCall();
            };

            $scope.removeStickmen = function () {
                if ($scope.stickManMarkers.length) {
                    for (j = 0; j < $scope.stickManMarkers.length; j++) {

                        $scope.stickManMarkers[j].setMap(null);


                    }


                }

                while ($scope.stickManMarkers.length > 0) {
                    $scope.stickManMarkers.pop();
                }
            }

            $scope.showStickMan = function (lat, lon) {

                console.log(lat, lon);
                $scope.removeStickmen();


                var lati = lat.replace(/\s*\,.*!/, ''); // first 123
                var longi = lon.replace(/.*,\s*!/, ''); // second ,456
                var localPoint = new google.maps.LatLng(parseFloat(lati), parseFloat(longi));


                var pillImg = 'img/marker.png';
                var stickManPos = new google.maps.Marker({ // create a marker and set id

                    position: localPoint,
                    map: map,
                    icon: pillImg,
                    animation: google.maps.Animation.DROP
                });

                $scope.stickManMarkers.push(stickManPos);


            };


            function makePostCall() {


                $scope.showCardStack = false;
                var postObj = {};
                getAlldataSearch();
                console.log("user info--->", sendSearch)
                $scope.removeStickmen();
                cardService.data.cardFlag = 0;
                deleteMarker(markers);

                addressService.goGet(sendSearch.latitude, sendSearch.longitude, function (address) {
                    $scope.addressFromMap = address;
                    //$scope.data.searchAddress = address;
                });

                updateRad(eval(sendSearch.radius));

                //console.log(sendSearch);
                Crud.create({root: "categories/list_view.json"}, sendSearch, function (response) {



                    console.log(response);
                    //console.log(response)
                    if (response.status) {


                        //console.log("its there");
                        cardService.data.cardFlag = 1;
                        cardService.data.resArr = response.result;
                        //$scope.data.cardsCount = response.result.count;
                        console.log(response.result.length);

                        $scope.resultArrLen = response.result.length;
                        $scope.stickManArr = response.result;
                        console.log($scope.stickManArr);


                        $scope.showCount = true;
                        $scope.data.cardsCount = response.result.length;
                        //console.log(response);
                        postObj = response.result;

                        addPills(map, postObj);
                        $scope.showStickMan($scope.stickManArr[response.result.length - 1].Post.latitude, $scope.stickManArr[response.result.length - 1].Post.longitude);

                        if (response.result.length >= 2) {
                            $scope.showCardStack = true;
                        } else {
                            $scope.showCardStack = false;
                        }
                    } else {
                        $scope.showCount = false;
                        $scope.data.cardsCount = undefined;
                    }
                });
            }


            function deleteMarker(markers) {
                //console.log(markers);
                if (markers.length) {
                    for (j = 0; j < markers.length; j++) {

                        markers[j].setMap(null);


                    }


                }

                while (markers.length > 0) {
                    markers.pop();
                }


            }


            var markers = [];

            function addPills(map, postVals) {

                deleteMarker(markers);

                for (i in postVals) {

                    if (postVals.hasOwnProperty(i)) {

                        var lat = postVals[i].Post.latitude.replace(/\s*\,.*/, ''); // first 123
                        var lng = postVals[i].Post.longitude.replace(/.*,\s*/, ''); // second ,456
                        locate = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));


                        var pillImg = 'img/inactive.png';
                        var marker = new google.maps.Marker({ // create a marker and set id

                            position: locate,
                            map: map,
                            icon: pillImg,
                            animation: google.maps.Animation.DROP
                        });
                        markers.push(marker); // cache created marker to markers object with id as its key


                    }
                }


            }


            $scope.checkUserLogin = function () {
                if (userLogin.user_id == "") {

                    $ionicPopup.alert({
                        title: "Error",
                        content: "Please login to continue"
                    }).then(function (res) {
                        if (res) {
                            $scope.closeListModel();
                            $state.go('green.login');
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({
                                disableBack: true,
                                historyRoot: true
                            });
                        } else {
                            $scope.closeListModel();
                            $state.go('green.login');
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({
                                disableBack: true,
                                historyRoot: true
                            });
                        }
                    });
                    return false;
                } else {
                    return true;
                }
            };

            $scope.showDetails = function (postid) {
                $ionicActionSheet.show({
                    buttons: [
                        {text: 'Add to Favorites'},
                        {text: 'respond'},
                        {text: 'Write a review'},
                        {text: 'Report Abuse'}
                    ],
                    // destructiveText: 'Delete',
                    // cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        //alert(index);
                        switch (index) {
                            case 0:
                                if ($scope.checkUserLogin()) {


                                    var favoObj = {};
                                    favoObj.user_id = userLogin.user_id;
                                    favoObj.post_id = postid;
                                    favoObj.app_id = 1;
                                    Crud.create({
                                        root: "favourites/favourite.json"
                                    }, favoObj, function (response) {
//                                    console.log(response);
                                        if (response.message == "success") {
                                            $ionicPopup.alert({
                                                title: "Success",
                                                content: "Successfuly added to your favorite list"
                                            }).then(function (res) {

                                            })
                                        } else {
                                            $ionicPopup.alert({
                                                title: "Error",
                                                content: response.message
                                            }).then(function (res) {

                                            })
                                        }
                                    });

                                }
                                break;
                            case 1:
                                //respond

                                break;
                            case 2:
                                if ($scope.checkUserLogin()) {
                                    $scope.data.rating = 1;

                                    $ionicPopup.confirm({
                                        title: 'Review',
                                        scope: $scope,
                                        templateUrl: "review_post.html"
                                    }).then(function (res) {
                                        if (res) {
                                            var reviewObj = {};
                                            reviewObj.user_id = userLogin.user_id;
                                            reviewObj.post_id = postid;
                                            reviewObj.rating = $scope.data.rating;
                                            reviewObj.message = $scope.data.message;
                                            reviewObj.app_id = 1;
                                            console.log(reviewObj);
                                            Crud.create({root: "reviews/review.json"}, reviewObj, function (response) {
                                                if (response.status) {
                                                    $ionicPopup.alert({
                                                        title: "Success",
                                                        content: "Successfully added the review"
                                                    }).then(function (res) {

                                                    })
                                                }
                                            });

                                        } else {

                                        }
                                    });

                                }

                                break;
                            case 3:
                                if ($scope.checkUserLogin()) {
                                    $ionicPopup.confirm({
                                        title: 'Report abuse',
                                        scope: $scope,
                                        templateUrl: "abused_post.html"
                                    }).then(function (res) {
                                        if (res) {
                                            var reviewObj = {};
                                            reviewObj.user_id = userLogin.user_id;
                                            reviewObj.post_id = postid;
                                            reviewObj.message = $scope.data.message_abuse;

                                            console.log(reviewObj);
                                            Crud.create({root: "reviews/report_abuse.json"}, reviewObj, function (response) {
                                                //console.log(response)
                                                if (response.message = "success") {
                                                    $ionicPopup.alert({
                                                        title: "Success",
                                                        content: "Report has been received"
                                                    }).then(function (res) {

                                                    })
                                                }
                                            });

                                        } else {

                                        }
                                    });
                                }
                                break;
                        }

                        return true;
                    }
                });

            };


            //google.maps.event.addDomListener(window, 'load', init);
        })


        .controller('CardsCtrl', function ($scope, $http, $ionicSwipeCardDelegate, cardService, postList) {
            $scope.cards = [];
            $scope.value = 0;
            console.log($scope.cards);


            $scope.service = cardService;
            $scope.$watch('service.data.cardFlag', function (newValue) {
                $scope.value = newValue;

                if ($scope.value == 1) {
                    cardFunc(cardService.data.resArr);
                } else if ($scope.value == 0) {
                    removeAllCards();
                }
                //console.log(newValue);

            });

            function removeAllCards() {
                $scope.cards = [];
                console.log($scope.cards.length);
                postList.listOfPostsArr = '';
            }


            function cardFunc(arr) {


                var users = arr;
                postList.listOfPostsArr = arr;


                $scope.addCard = function (t, h, b, p, o, z, n, l, lat, lon, back) {
                    var newCard = {"title": t, "location": h, "summary": b, "post_id": p, "detail_obj": o, "zIndex": z, 'index': n, "total": l, "latitude": lat, "longitude": lon, "background": back};

                    $scope.cards.unshift(angular.extend({}, newCard));
                };

                $scope.addCardDyno = function (t, h, b, p, o, z, n, l, a, lat, lon, back) {
                    var newCard = {"title": t, "location": h, "summary": b, "post_id": p, "detail_obj": o, "zIndex": z, 'index': n, "total": l, opacity: a, "latitude": lat, "longitude": lon, "background": back};

                    $scope.cards.push(angular.extend({}, newCard));
                };


                $scope.addCards = function (count) {


                    angular.forEach(users, function (v, k) {
                        $scope.addCard(v.Post.title, v.Post.location, v.Post.summary, v.Post.post_id, v, k, users.length - (k), users.length, v.Post.latitude, v.Post.longitude, $scope.isOwnerCard(v.User.user_id));
                    });
                    $scope.showCards = true;

                };

                $scope.addCards(0);

                $scope.cardSwiped = function (index) {
                    //console.log(index);
                    console.log($scope.cards);
                };

                $scope.cardDestroyed = function (index) {
                    //console.log("indexVal - >"+ index);
                    var oldcard = $scope.cards.splice(index, 1);
                    console.log(oldcard);



                    console.log($scope.cards);
                    if ($scope.cards.length != 0) {
                        $scope.cards[index].zIndex = (oldcard[0].zIndex) + 1;
                        //$scope.cards[index+1].zIndex = (oldcard[0].zIndex)+1;
                        $scope.addCardDyno(oldcard[0].title, oldcard[0].location, oldcard[0].summary, oldcard[0].post_id, oldcard[0].detail_obj, 0, ((oldcard[0].zIndex + 1) % $scope.resultArrLen) + 1, $scope.resultArrLen, 0, oldcard[0].latitude, oldcard[0].longitude, oldcard[0].background);
                    } else {
                        //console.log("its else part")
                        $scope.addCardDyno(oldcard[0].title, oldcard[0].location, oldcard[0].summary, oldcard[0].post_id, oldcard[0].detail_obj, oldcard[0].zIndex, 1, 1, 1, oldcard[0].latitude, oldcard[0].longitude, oldcard[0].background);
                        //t, h, b, p, o, z,n,l,a,lat,lon,back
                        //{"title": t, "location": h, "summary": b, "post_id": p, "detail_obj": o, "zIndex": z,'index':n,"total":l,opacity:a,"latitude":lat,"longitude":lon,"background":back};
                    }


                    /*  var indexVal = (oldcard[0].zIndex)-1;
                     indexVal = indexVal%$scope.resultArrLen;
                     console.log("indexVal - >"+ (indexVal));*/

                    //console.log("the cards",$scope.cards)
                    $scope.showStickMan($scope.cards[0].latitude, $scope.cards[0].longitude);

                };

                //console.log($scope.cards.length);

            }


        })
        .controller('CardCtrl', function ($scope, $ionicSwipeCardDelegate, userLogin, check, Crud) {
            //$scope.goAway = function () {
            //    var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
            //    card.swipe();
            //    console.log("workin");
            //};


            $scope.subscribeToPost = function (post_id) {
                //var card = $ionicSwipeCardDelegate.getSwipeableCard($scope);
                //card.swipe();
                if (check.checkUserLogin()) {
                    var subscribeObj = {};
                    subscribeObj.user_id = userLogin.user_id;
                    subscribeObj.post_id = post_id;
                    subscribeObj.app_id = 1;

                    Crud.create({root: "posts/request_post.json"}, subscribeObj, function (response) {
                        console.log(response);
                    });
                }

            }


        })
        .directive('actualSrc', function () {
            return {
                link: function postLink(scope, element, attrs) {
                    attrs.$observe('actualSrc', function (newVal, oldVal) {
                        if (newVal != undefined) {
                            var img = new Image();
                            img.src = attrs.actualSrc;
                            angular.element(img).bind('load', function () {
                                element.attr("src", attrs.actualSrc);
                            });
                        }
                    });

                }
            }
        })
