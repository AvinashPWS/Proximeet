angular.module('ionicApp.factories', ['ngResource'])
    .factory("Crud", function ($resource) {
        function formDataObject(data) {
            var fd = new FormData();
            angular.forEach(data, function (value, key) {
                fd.append(key, value);
            });
            return fd;
        }

        //actual link
        //http://gd.pacewisdom.com/:root


        //local
        //http://192.168.1.26/greendiamond/:root



        //        var resource = $resource("http://78.47.154.117/greendiamond/:root", {
        //        var resource = $resource("http://78.47.154.117/production/greendiamond/:root", {

        //            var resource = $resource("http://78.47.154.117/production/proximeet/:root", {
        var resource = $resource("http://78.47.154.117/proximeet/:root", {
            root: "@root"
        }, {
                'create': {
                    method: 'POST',
                    transformRequest: formDataObject,
                    headers: {
                        'Content-Type': undefined,
                        enctype: 'multipart/form-data'
                    }
                },
                'index': {
                    method: 'GET'
                },
                'show': {
                    method: 'GET'
                },
                'update': {
                    method: 'PUT'
                },
                'destroy': {
                    method: 'DELETE'
                }
            });
        return resource;
    })
    .factory("postList", function () {
        var ListOfPost = {};
        ListOfPost.listOfPostsArr = "";
        return ListOfPost;
    }).factory('Camera', ['$q',
        function ($q) {

            return {
                getPicture: function (options) {
                    var q = $q.defer();
                    navigator.camera.getPicture(function (result) {
                        // Do any magic you need
                        q.resolve(result);
                    }, function (err) {
                        q.reject(err);
                    }, {
                            quality: 100,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: true,
                            encodingType: Camera.EncodingType.JPEG,
                            targetWidth: 450,
                            targetHeight: 450,
                            saveToPhotoAlbum: false,
                            correctOrientation: true
                        });
                    return q.promise;
                }
            }
        }
    ]).factory('Gallery', ['$q',
        function ($q) {

            return {
                getPicture: function (options) {
                    var q = $q.defer();
                    navigator.camera.getPicture(function (result) {
                        // Do any magic you need
                        var d = new Date();
                        window.resolveLocalFileSystemURL(result, function (fileEntry) {
                            fileEntry.getParent(function (parent) {

                                fileEntry.moveTo(parent, d.getTime() + fileEntry.name, function (s) {
                                    result = s.nativeURL;
                                    q.resolve(result);
                                }, function (error) {
                                    alert('Error on moving file!');
                                });
                            }, function (error) {
                                alert('Error on getting parent!');
                            });
                        }, function (err) {


                        });
                        //q.resolve(result);
                    }, function (err) {
                        q.reject(err);
                    }, {
                            quality: 100,
                            destinationType: Camera.DestinationType.NATIVE_URI,
                            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                            allowEdit: 1,
                            encodingType: Camera.EncodingType.JPEG,
                            targetWidth: 450,
                            targetHeight: 450,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false,
                            correctOrientation: true
                        });
                    return q.promise;
                }
            }
        }
    ]).factory('sharedMapList', function ($rootScope) {
        var sharedService = {};
        sharedService.listArr = [];
        sharedService.prepForBroadcast = function (arr) {
            this.listArr = arr;
            this.broadcastItem();
        };
        sharedService.broadcastItem = function () {
            $rootScope.$broadcast('handleBroadcastList');
        };
        return sharedService;
    }).factory("shareDetail", function () {
        var shareDetailObj = {};
        shareDetailObj.postDetail = "";
        shareDetailObj.inituscriber = "";
        return shareDetailObj
    }).factory("subscribersList", function () {
        var listOfSubscribeObj = {};
        listOfSubscribeObj.listSubscribers = "";
        return listOfSubscribeObj;
    }).factory("sharablePostedAd", function () {
        var postedObj = {};
        postedObj.post = "";
        return postedObj;
    }).factory("sharableMyAds", function () {
        var myAdObj = {};
        myAdObj.post = "";
        return myAdObj;
    })
    .factory("sharableRateReview", function () {
        var rateReviewObj = {};
        rateReviewObj.arr = "";
        return rateReviewObj;
    })
    .factory("customDatePick", function ($cordovaDatePicker, $q) {

        var retObj = {};
        var dateOperator = function (spec, mode) {
            var finalminDate, finalDateTime, selectedDate;
            var deferred = $q.defer();
            if (spec.fromDate || spec.toDate) {
                console.log(spec);
                if (spec.toDate && spec.toDate) {
                    if (spec.direction == "from") {
                        selectedDate = new Date(spec.fromDate);
                        finalminDate = new Date() - 10000;
                    } else {
                        selectedDate = new Date(spec.toDate);
                        finalminDate = new Date(spec.fromDate).setDate((new Date(spec.fromDate)).getDate())
                    }

                } else if (spec.fromDate) {
                    selectedDate = new Date(spec.fromDate);
                    if (spec.direction == "from") {
                        finalminDate = new Date() - 10000;
                    } else {
                        finalminDate = new Date(spec.fromDate).setDate((new Date(spec.fromDate)).getDate())
                    }
                }
            } else if (spec.date && spec.time) {
                selectedDate = new Date(spec.date + " " + spec.time);
                finalminDate = new Date() - 10000;
            } else {
                selectedDate = new Date();
                finalminDate = new Date() - 10000;
            }

            var options = {
                date: selectedDate,
                mode: mode, // or 'time'
                minDate: finalminDate,
                allowOldDates: false,
                allowFutureDates: false,
                doneButtonLabel: 'DONE',
                doneButtonColor: '#F2F3F4',
                cancelButtonLabel: 'CANCEL',
                cancelButtonColor: '#000000'
            };
            $cordovaDatePicker.show(options).then(function (datetime) {
                if (datetime) {
                    if (mode == 'date') {
                        finalDateTime = moment(datetime).format("DD-MMM-YYYY");
                        deferred.resolve(finalDateTime)
                    } else {
                        finalDateTime = moment(datetime).format("hh:mm A");
                        deferred.resolve(finalDateTime)
                    }
                } else {
                    deferred.resolve(undefined);
                }

            });
            return deferred.promise;
        };
        retObj.getDateTime = function (type, mode, specObj) {

            var datetimeDefer = $q.defer();
            switch (type + "-" + mode) {
                case "from-date":
                    console.log("return from Date");
                    dateOperator(specObj, mode).then(function (date) {
                        datetimeDefer.resolve(date);
                    });
                    break;
                case "from-time":
                    dateOperator(specObj, mode).then(function (date) {
                        datetimeDefer.resolve(date);
                    });
                    break;
                case "to-date":
                    dateOperator(specObj, mode).then(function (date) {
                        datetimeDefer.resolve(date);
                    });
                    break;
                case "to-time":
                    dateOperator(specObj, mode).then(function (date) {
                        datetimeDefer.resolve(date);
                    });
                    break;
            }

            return datetimeDefer.promise;
        };
        return retObj;
    })

    /*    .factory('backend', ['$http',"$q","$timeout", function($http, $q , $timeout) {
     
     var deferred = $q.defer();
     
     var urlBase = 'http://gd.pacewisdom.com/';
     var backendObj = {};
     
     backendObj.get = function (url) {
     return $http.get(urlBase+url,{ timeout: deferred.promise });
     };
     
     backendObj.post = function (url) {
     return $http.get(urlBase +url,{ timeout: deferred.promise });
     };
     
     
     $timeout(function() {
     console.log("aaa");
     deferred.resolve(); // this aborts the request!
     }, 4000);
     
     return backendObj;
     }]);*/

    .factory('socket', function ($rootScope) {
        //        var socket = io.connect('http://78.47.154.117:3001/');  // PROD
        var socket = io.connect('http://78.47.154.117:4001/'); //TEST DEV
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });
