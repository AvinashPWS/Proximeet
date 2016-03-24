angular.module('ionicApp.postCtrl', [])
        .controller('postCtrl', function ($q, $cordovaDatePicker, $scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state
                , Crud, $filter, $http, Camera, Gallery, $ionicLoading, customDatePick) {
            $scope.name = $state.current.name;


            $scope.$watch("data.slots", function (val) {
                console.log(val)
                if (val) {
                    if (val.toString().length > 8) {
                        $scope.data.slots = parseInt(val.toString().substr(0, 7))
                    }
                    if (val.toString().indexOf('.') != "-1") {
                        document.activeElement.blur();
                        alerter("Alert", "Decimal point is not allowed");
                        $scope.data.slots = undefined;
                    }
                }
            })

            $scope.$watch("data.cost", function (val) {
                //console.log(val);
                if (val) {
                    if (val.toString().indexOf('.') != "-1") {
                        document.activeElement.blur();
                        alerter("Alert", "Decimal point is not allowed");
                        $scope.data.cost = undefined;
                    }
                }

                if ((val + "").length > 5 && val != undefined) {
                    document.activeElement.blur();
                    alerter("Alert", "Please enter amount less than 5 digits");
                    $scope.data.cost = undefined;

                }
            });

            $scope.must_login = function () {
                $ionicHistory.clearCache();
                if (!userLogin.isLoggedIn) {

                    navigator.app.clearHistory();
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $state.go('green.login');

                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        disableAnimate: true,
                        historyRoot: true
                    });
                }


            };
            $scope.must_login();

            $scope.gotoMenuThree = function () {
                $state.go('green.threeMenu');
            };

            //$ionicHistory.clearCache();
            //$ionicHistory.clearHistory();
            //$ionicPlatform.registerBackButtonAction(function (event) {
            //
            //    if($state.current.name=="green.post"){
            //        $ionicPopup.confirm({
            //            title: "Exiting app",
            //            template: 'Are you sure you want to Exit?'
            //        }).then(function(res){
            //            if(res) {
            //                navigator.app.exitApp();
            //            }
            //            else{
            //                navigator.app.clearHistory();
            //                $ionicHistory.clearCache();
            //                $ionicHistory.clearHistory();
            //            }
            //        })
            //    }
            //
            //
            //},100)


            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicPlatform.registerBackButtonAction(function () {


                if (!userLogin.isLoggedIn) {
                    if ($state.current.name == "green.post") {
                        navigator.app.clearHistory();
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $state.go('green.login');

                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            disableAnimate: true
                        });
                    }


                } else {
                    if ($state.current.name == "green.post") {
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

            $scope.showLoginErr = false;


            if (!userLogin.isLoggedIn) {
                $scope.showLoginErr = true;

            }


            console.log($scope.showLoginErr);


            var categories;
            if (userLogin.isLoggedIn) {
                categories = Crud.index({
                    root: 'categories/categorylist.json'
                });
                categories.$promise.then(function (data) {
                    $scope.listOfCategories = data.response;

                })
            }

            var getPhotoCamera = function () {
                Camera.getPicture().then(function (imageURI) {
                    $scope.imagePath = imageURI;
                }, function (err) {
                    console.err(err);
                });
            };


            var getPhotoGallery = function () {
                Gallery.getPicture().then(function (imageURI) {
                    $scope.imagePath = imageURI;
                }, function (err) {
                    console.err(err);
                });
            };


            $scope.data = {};


            $scope.data.email = localStorage.email;
            $scope.data.phone = localStorage.phone_no;
            //$scope.data.title = "sample";


            var geocoder = new google.maps.Geocoder();



            $scope.$watch('data.searchAddress', function (query) {
                if (query == "") {
                    $scope.locations = undefined;
                    $scope.data.location = undefined;
                    $scope.data.searchAddress = undefined;
                }
                var request = {
                    address: query,
                    componentRestrictions: {
                        country: 'INDIA'
                    }
                }

                geocoder.geocode(request, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        $scope.$apply(function () {
                            $scope.locations = results;
                            //console.log($scope.locations);
                        });
                    } else {
                        // @TODO: Figure out what to do when the geocoding fails
                    }
                });
            }, true);


            $scope.selectLocation = function (addressObj) {
                $scope.data.location = addressObj.formatted_address;
                $scope.data.searchAddress = addressObj.formatted_address;
                console.log($scope.data.location);
                $scope.openMapSelector();
                lati = undefined;
                lon = undefined;

                $scope.data.lati = undefined;
                $scope.data.long = undefined;

                $scope.data.latlon = undefined;
                $scope.addressmodal.hide();
                $scope.addressmodal.remove();
            };


            $scope.getLocationAddress = function () {
                if ($scope.data.location) {
                    $scope.data.searchAddress = $scope.data.location;
                }

                $ionicModal.fromTemplateUrl('selectAddress.html', {
                    scope: $scope,
                    animation: 'scale-in'
                }).then(function (modal) {
                    $scope.addressmodal = modal;
                    modal.show();


                });


                $scope.closeAddressModal = function () {
                    if (!$scope.data.searchAddress) {
                        $scope.locations = undefined;
                        $scope.data.searchAddress = undefined;
                        $scope.data.location = undefined;
                        lati = undefined;
                        lon = undefined;
                        $scope.data.latlon = undefined;
                    }
                    $scope.addressmodal.hide();
                    $scope.addressmodal.remove();
                };


                $ionicPlatform.on('backbutton', function (e) {
                    $scope.addressmodal.hide();
                    $scope.addressmodal.remove();
                    if (!$scope.data.searchAddress) {
                        //$scope.data.location = undefined;
                    }
                });

            };


            function alerter(title, message) {
                $ionicPopup.alert({
                    title: title,
                    content: message
                }).then(function (res) {

                });
            }


            $scope.fromDateTrig = function () {
                customDatePick.getDateTime("from", "date", {
                    fromDate: $scope.data.fromDate,
                    toDate: $scope.data.toDate,
                    direction: "from"
                }).then(function (date) {
                    $scope.data.fromDate = date;
                    if (new Date($scope.data.fromDate) > new Date($scope.data.toDate)) {
                        $scope.data.toDate = undefined;
                    }
                    if ($scope.data.fromDate) {
                        if (new Date($scope.data.fromDate + " " + $scope.data.fromTime) < new Date((new Date()).setMinutes((new Date()).getMinutes() - 10))) {
                            $scope.data.fromTime = undefined;
                            /*$ionicPopup.alert({
                             title: 'Alert!',
                             template: 'Please Enter Valid Time '
                             }).then(function (res) {
                             
                             });*/
                        }
                    }
                })

            };

            $scope.fromTimeTrig = function () {
                customDatePick.getDateTime("from", "time", {}).then(function (time) {
                    $scope.data.fromTime = time;
                    if ($scope.data.fromDate) {
                        if (new Date($scope.data.fromDate + " " + $scope.data.fromTime) < new Date((new Date()).setMinutes((new Date()).getMinutes() - 10))) {
                            $scope.data.fromTime = undefined;
                            $ionicPopup.alert({
                                title: 'Alert!',
                                template: 'Please Enter Valid Time '
                            }).then(function (res) {

                            });
                        }
                    } else {
                        $scope.data.fromTime = undefined;
                        $ionicPopup.alert({
                            title: 'Alert!',
                            template: 'Please Enter Date first'
                        }).then(function (res) {

                        });
                    }

                })

            };

            $scope.toDateTrig = function () {
                if ($scope.data.fromDate) {
                    customDatePick.getDateTime("to", "date", {
                        fromDate: $scope.data.fromDate,
                        toDate: $scope.data.toDate,
                        direction: "to"
                    }).then(function (date) {
                        $scope.data.toDate = date;
                    })
                } else {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Please select from date first'
                    }).then(function (res) {

                    });
                }

            }


            $scope.toTimeTrig = function () {

                customDatePick.getDateTime("to", "time", {}).then(function (time) {
                    $scope.data.toTime = time;

                    if (new Date($scope.data.toDate + " " + $scope.data.toTime) < new Date($scope.data.fromDate + " " + $scope.data.fromTime)) {
                        $scope.data.toTime = undefined;
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Please select end time more than from time'
                        }).then(function (res) {

                        });
                    }

                })

            };

            //From date

            //$scope.$watch('data.fromDate', function (unformattedDate) {
            //    $scope.data.fromDateFormated = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm');
            //});
            //$scope.openFromDatePicker = function () {
            //    $scope.tmp = {};
            //    $scope.tmp.newDate = $scope.data.fromDate;
            //
            //    var DatePopup = $ionicPopup.show({
            //        template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
            //        title: "Pick Date and Time",
            //        scope: $scope,
            //        buttons: [{
            //            text: 'Cancel'
            //        }, {
            //            text: '<b>Save</b>',
            //            type: 'button-positive',
            //            onTap: function (e) {
            //                $scope.data.fromDate = $scope.tmp.newDate;
            //            }
            //        }]
            //    });
            //}
            //
            //
            ////To date
            //$scope.$watch('data.toDate', function (unformattedDate) {
            //    $scope.data.toDateFormated = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm');
            //});
            //$scope.openToDatePicker = function () {
            //    $scope.tmp = {};
            //    $scope.tmp.newDate = $scope.data.toDate;
            //
            //    var DatePopup = $ionicPopup.show({
            //        template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
            //        title: "Pick Date and Time",
            //        scope: $scope,
            //        buttons: [{
            //            text: 'Cancel'
            //        }, {
            //            text: '<b>Save</b>',
            //            type: 'button-positive',
            //            onTap: function (e) {
            //                $scope.data.toDate = $scope.tmp.newDate;
            //            }
            //        }]
            //    });
            //}
            //
            ////Venu Date
            //$scope.$watch('data.venuDate', function (unformattedDate) {
            //    $scope.data.venuDateFormated = $filter('date')(unformattedDate, 'yyyy-MM-dd HH:mm');
            //});
            //$scope.openVenuDatePicker = function () {
            //    $scope.tmp = {};
            //    $scope.tmp.newDate = $scope.data.venuDate;
            //
            //    var DatePopup = $ionicPopup.show({
            //        template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
            //        title: "Pick Date and Time",
            //        scope: $scope,
            //        buttons: [{
            //            text: 'Cancel'
            //        }, {
            //            text: '<b>Save</b>',
            //            type: 'button-positive',
            //            onTap: function (e) {
            //                $scope.data.venuDate = $scope.tmp.newDate;
            //            }
            //        }]
            //    });
            //}
            var lati, lon;


            var finalLat, finalLon;

            function trigMapModelPost(lat, lng) {
                //$ionicModal.fromTemplateUrl('pickLocation.html', {
                //    scope: $scope,
                //    animation: 'scale-in'
                //}).then(function (modal) {
                //    $scope.mapPopup = modal;
                //    modal.show()
                //});

                function initializeMapPopup() {

                    var mapOptions = {
                        zoom: 17,
                        panControl: false,
                        zoomControl: false,
                        scaleControl: true,
                        overviewMapControl: true,
                        disableDefaultUI: true,
                        streetViewControl: false,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        enableHighAccuracy: true
                    };

                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);


                    lati = lat;
                    lon = lng;
                    map.setCenter(new google.maps.LatLng(lat, lng));
                    var myLocation = new google.maps.Marker({
                        position: new google.maps.LatLng(lat, lng),
                        map: map,
                        title: "My Location"
                    });
                    myLocation.setDraggable(true);

                    google.maps.event.addListener(myLocation, "dragend", function (event) {
                        lati = event.latLng.lat();
                        lon = event.latLng.lng();
                        console.log(event.latLng.lat());
                        console.log(event.latLng.lng());
                        var point = myLocation.getPosition();
                        map.panTo(point);

                    });


                    $scope.map = map;
                }

                $ionicModal.fromTemplateUrl('pickLocation.html', {
                    scope: $scope,
                    animation: 'scale-in'
                }).then(function (modal) {
                    $scope.mapmodal = modal;
                    modal.show();
                    initializeMapPopup();
                });

                $scope.clearMapPart = function () {
                    if ($scope.data.lati == undefined && $scope.data.long == undefined) {
                        $ionicPopup.alert({
                            title: 'Alert!',
                            content: "Previously selected Address will be dismissed!"
                        }).then(function (res) {
                            $scope.data.location = undefined;
                            $scope.data.searchAddress = undefined;
                            $scope.mapmodal.hide();
                            $scope.mapmodal.remove();
                        });
                    }
                    //alert($scope.data.lati+" "+$scope.data.long);
                }

                $scope.clearAddress = function () {
                    $scope.data.searchAddress = undefined;
                };


                $scope.closeModal = function () {
                    console.log(lati, lon);

                    $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lati + ',' + lon + '&sensor=true').success(function (data) {
                        console.log(data.results[0].formatted_address)
                        $scope.data.location = data.results[0].formatted_address;
                        console.log($scope.data.location);
                    }).error(function (e) {
                        console.log(e);
                    });
                    $scope.data.latlon = lati + " " + lon;
                    $scope.data.lati = lati;
                    $scope.data.long = lon;
                    $scope.mapmodal.hide();
                    $scope.mapmodal.remove();
                };

                //$scope.$on('$destroy', function () {
                //    $scope.mapmodal.remove();
                //});

                $ionicPlatform.on('backbutton', function (e) {
                    // Execute action
                    $scope.mapmodal.hide();
                    $scope.mapmodal.remove();

                });

            }


            function mapLocation(a) {
                var latilongi = {};

                console.log(a);

                $http.get("http://maps.google.com/maps/api/geocode/json?address=" + a + "&sensor=false")
                        .success(function (response) {
                            console.log(response.results[0].geometry.location);
                            if (lati != undefined && lon != undefined) {
                                trigMapModelPost(lati, lon)
                            } else {
                                trigMapModelPost(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng)
                            }
                        });

                return latilongi;
            }

            $scope.openMapSelector = function () {
                if ($scope.data.location != undefined) {
                    var address = $scope.data.location;
                    mapLocation(address);
                    console.log(address);

                } else {
                    $ionicPopup.alert({
                        title: 'Address',
                        content: "Please select the adddress before picking location"
                    }).then(function (res) {

                    });
                }
            }

            $scope.data.costmethod = 0;

            $scope.costdisable = true;
            $scope.$watch("data.costmethod", function (val) {
                if (val == 0) {
                    $scope.costdisable = true;
                    $scope.data.cost = undefined;
                    $scope.isCostRequired = false;

                } else if (val == 1) {
                    $scope.costdisable = false;
                    $scope.isCostRequired = true;
                }
            });


            function noFileCall(userObj) {
                var postData = {};


                var postwithnofile = function () {
                    if (postData.to_time) {
                        postData.end_datetime = moment(new Date(postData.to_date + " " + postData.to_time)).format("YYYY-MM-DD HH:mm");
                    } else {
                        postData.end_datetime = moment(new Date(postData.from_date + " " + "23:59:00")).format("YYYY-MM-DD HH:mm");
                    }
                    Crud.create({
                        root: "posts/post.json"
                    }, postData, function check(response) {
                        console.log(response);
                        console.log(postData);
                        if (response.status) {
                            $ionicPopup.alert({
                                title: 'Success',
                                content: "Successfully Submitted"
                            }).then(function (res) {
                                $state.go("green.myAds");
                                $ionicHistory.clearCache();
                                $ionicHistory.clearHistory();
                                $ionicHistory.nextViewOptions({
                                    disableBack: true,
                                });
                            });
                            $scope.data = {}
                        } else {
                            var error_msg = "";
                            for (var key in response.message) {
                                var value = response.message[key];
                                error_msg += "<b>" + key + "</b> - " + value + "<br>";
                            }
                            $ionicPopup.alert({
                                title: 'Error',
                                content: error_msg
                            }).then(function (res) {

                            })
                        }
                    });
                };


                postData.app_id = 1;
                postData.provider_id = userLogin.user_id;
                postData.category_id = userObj.category_id;
                postData.title = userObj.title;
                postData.summary = (userObj.summary) ? userObj.summary : "Not Mentioned";
                postData.purpose = (userObj.purpose) ? userObj.purpose : "Not Mentioned";
                postData.from_date = userObj.fromDate;
                postData.from_time = userObj.fromTime;
                postData.to_date = userObj.toDate;
                postData.to_time = (userObj.toTime) ? userObj.toTime : "23:59:00";
                ;
                postData.no_of_slots = (userObj.slots) ? (userObj.slots + "").replace(/\+|\-/ig, '') : 0;
                postData.latitude = userObj.lati;
                postData.longitude = userObj.long;
                postData.location = userObj.location;
                postData.email = userObj.email;
                postData.phone_no = userObj.phone;
                postData.costing = (userObj.cost) ? (userObj.cost + "").replace(/\+|\-/ig, '') + " Rs" : 'Free';

                console.log("final Obj no file ---> ", postData);

                if (!userObj.toDate) {
                    $ionicPopup.confirm({
                        title: 'Alert!',
                        content: "End Date is not defined, would you like to make it as same as Start Date"
                    }).then(function (res) {
                        //console.log(res)
                        if (res) {
                            postData.to_date = userObj.fromDate;
                            /*postData.to_date = moment(new Date(postData.to_date)).format("YYYY-MM-DD");
                             postData.from_date = moment(new Date(postData.from_date)).format("YYYY-MM-DD");*/
                            postData.venue_time = moment(new Date(postData.from_date + " " + postData.from_time)).format("YYYY-MM-DD HH:mm");
                            $scope.data.toDate = userObj.toDate;
                            if (new Date(postData.to_date + " " + postData.to_time) < new Date(postData.from_date + " " + postData.from_time)) {
                                $scope.data.toTime = undefined;
                                $ionicPopup.alert({
                                    title: 'Alert!',
                                    template: 'Please select end time more than from time'
                                }).then(function (res) {

                                });
                            } else {
                                postwithnofile()
                            }
                            console.log(postData);
                        }
                    });
                } else {
                    postData.venue_time = moment(new Date(postData.from_date + " " + postData.from_time)).format("YYYY-MM-DD HH:mm")
                    console.log(postData);
                    /*postData.to_date = moment(new Date(postData.to_date)).format("YYYY-MM-DD");
                     postData.from_date = moment(new Date(postData.from_date)).format("YYYY-MM-DD");*/
                    if (new Date(postData.to_date + " " + postData.to_time) < new Date(postData.from_date + " " + postData.from_time)) {
                        $scope.data.toTime = undefined;
                        $ionicPopup.alert({
                            title: 'Alert!',
                            template: 'Please select end time more than from time'
                        }).then(function (res) {

                        });
                    } else {
                        postwithnofile()
                    }
                }


                console.log(postData);
            }


            function fileCall(file, postVals) {

                var options = new FileUploadOptions();
                options.fileKey = "file_path";
                options.fileName = file.substr(file.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";

                var params = new Object();
                //params.value1 = "test";
                //params.value2 = "param";


                params.app_id = 1;
                params.provider_id = userLogin.user_id;
                params.category_id = postVals.category_id;
                params.title = postVals.title;
                params.summary = (postVals.summary) ? postVals.summary : "Not Mentioned";
                params.purpose = (postVals.purpose) ? postVals.purpose : "Not Mentioned";
                params.from_date = postVals.fromDate;
                params.from_time = postVals.fromTime;
                params.to_date = postVals.toDate;
                params.to_time = (postVals.toTime) ? postVals.toTime : "23:59:00";
                params.no_of_slots = (postVals.slots) ? (postVals.slots + "").replace(/\+|\-/ig, '') : 0;
                params.latitude = postVals.lati;
                params.longitude = postVals.long;
                params.location = postVals.location;
                params.email = postVals.email;
                params.phone_no = postVals.phone;
                params.venue_time = postVals.venuTime;
                params.costing = (postVals.cost) ? (postVals.cost + "").replace(/\+|\-/ig, '') + " Rs" : 'Free';

                console.log("post with file", params)

                options.params = params;
                options.chunkedMode = false;



                if (!postVals.toDate) {
                    $ionicPopup.confirm({
                        title: 'Alert!',
                        content: "End Date is not defined, would you like to make it as same as Start Date"
                    }).then(function (res) {
                        //console.log(res)
                        if (res) {
                            params.to_date = postVals.fromDate;
                            /*postData.to_date = moment(new Date(postData.to_date)).format("YYYY-MM-DD");
                             postData.from_date = moment(new Date(postData.from_date)).format("YYYY-MM-DD");*/
                            params.venue_time = moment(new Date(params.from_date + " " + params.from_time)).format("YYYY-MM-DD HH:mm")
                            if (new Date($scope.data.toDate + " " + $scope.data.toTime) < new Date($scope.data.fromDate + " " + $scope.data.fromTime)) {
                                $scope.data.toTime = undefined;
                                $ionicPopup.alert({
                                    title: 'Alert!',
                                    template: 'Please select end time more than from time'
                                }).then(function (res) {

                                });
                            } else {
                                postwithfile()
                            }
                        }
                    });
                } else {
                    params.venue_time = moment(new Date(params.from_date + " " + params.from_time)).format("YYYY-MM-DD HH:mm")
                    if (new Date($scope.data.toDate + " " + $scope.data.toTime) < new Date($scope.data.fromDate + " " + $scope.data.fromTime)) {
                        $scope.data.toTime = undefined;
                        $ionicPopup.alert({
                            title: 'Alert!',
                            template: 'Please select end time more than from time'
                        }).then(function (res) {

                        });
                    } else {
                        postwithfile()
                    }
                }

                function  postwithfile() {

                    if (params.to_time) {
                        params.end_datetime = moment(new Date(params.to_date + " " + params.to_time)).format("YYYY-MM-DD HH:mm");
                    } else {
                        params.end_datetime = moment(new Date(params.from_date + " " + "23:59:00")).format("YYYY-MM-DD HH:mm");
                    }

                    $ionicLoading.show({
                        template: '<div class="default-loader"><ion-spinner icon="ripple"></ion-spinner></div>'
                    })
                    var ft = new FileTransfer();
                    //ft.upload(file, "http://78.47.154.117/greendiamond/posts/post.json", win, fail, options);
                    ft.upload(file, $rootScope.ROUTES + "posts/post.json", win, fail, options);
                }



                function win(r) {
                    $ionicLoading.hide();
                    console.log("Code = " + r.responseCode);
                    console.log("Response = " + r.response);
                    console.log("Sent = " + r.bytesSent);


                    $ionicPopup.alert({
                        title: "Success",
                        content: "Successfully uploaded"
                    }).then(function (res) {
                        $state.go("green.myAds");
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                        });
                    })

                    $scope.imagePath = undefined;
                    $scope.data = {};
                }

                function fail(error) {
                    $ionicLoading.hide();
                    alert("An error has occurred: Code = " + error.code);
                }
            }

            $scope.postAnAd = function (form, file) {
                if (form.$valid && userLogin.user_id != "") {
                    if (!(angular.equals({}, $scope.data))) {
                        //console.log($scope.data)

                        console.log("costing -->", $scope.data.costing)


                        if (localStorage.email_verify == "1") {
                            if (file != undefined) {
                                fileCall(file, $scope.data)
                            } else if (file == undefined) {
                                noFileCall($scope.data)
                            }
                        } else {
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
                                })
                            })
                        }


                    }
                } else {
                    if ($scope.data.lati == undefined && $scope.data.long == undefined) {
                        $ionicPopup.alert({
                            title: 'Alert!',
                            content: "Please select Exact Location of your Address on the Map by dragging the map pointer"
                        }).then(function (res) {

                        })
                    } else {
                        $ionicPopup.alert({
                            title: 'Error',
                            content: "Some Fields are missing please Check"
                        }).then(function (res) {

                        })
                    }

                }

            }

            $scope.showImageSelect = function () {
                $ionicPopup.show({
                    template: '',
                    title: 'Choose the options below',
                    scope: $scope,
                    buttons: [
                        {
                            text: '<i class="ion-camera" style="font-size: 1.3em"></i>',
                            type: 'button-block',
                            onTap: function (e) {

                                return 'camera';
                            }
                        }, {
                            text: '<i class="ion-images"></i>',
                            type: 'button-block',
                            onTap: function (e) {
                                return 'gallery';
                            }
                        }, {
                            text: '<i class="ion-close"></i>',
                            type: 'button-block',
                            onTap: function (e) {
                                return 'cancel';
                            }
                        }
                    ]
                }).then(function (res) {
                    switch (res) {
                        case "camera":
                            console.log("camera");
                            getPhotoCamera();
                            break;
                        case "gallery":
                            getPhotoGallery();
                            console.log("gallery");
                            break;
                        case "cancel":
                            console.log("cancel");
                            break;
                    }
                }, function (err) {
                    console.log('Err:', err);
                }, function (msg) {
                    console.log('message:', msg);
                });
            }


        });
