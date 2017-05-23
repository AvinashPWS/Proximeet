angular.module('ionicApp.postDetailCtrl', [])

        .controller("postDetailCtrl", function ($location, socket, $ionicViewService, userLogin, shareDetail, $scope, $rootScope, $ionicPopup, Crud, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, $stateParams, sharableRateReview, chatData, $cordovaSocialSharing) {
            //$scope.name = $state.current.name;


            $ionicPlatform.onHardwareBackButton(function (e) {
                $ionicHistory.goBack();


            }, 100);

            $scope.shareBtn = false;

            $scope.shareThisPost = function () {
                console.log($scope.postDetail);

                //I have created an event "xxx did ddd " in ProxiMeet app. Please download the app from Google store "link to app" and you can subscribe to the event.

                var message = "Hi, check this event '" + $scope.postDetail.Post.title + "' in ProxiMeet app. Please download the app from Google store (link attached), and you can subscribe to the event";

                /*if ($scope.postDetail.Post.summary != "Not Mentioned") {
                 var simsum = ($scope.postDetail.Post.summary.substring(0, 10));
                 message = message + simsum + "..."
                 }*/


                $cordovaSocialSharing
                        .share(message, "An event from Proximeet", "", "https://play.google.com/store/apps/details?id=com.imagineit.proximeet") // Share via native share sheet
                        .then(function (result) {
                            // Success!


                        }, function (err) {
                            // An error occured. Show a message to the user
                        });
            }


            socket.emit('disconnect1', {"user_id": userLogin.user_id}, function (data) {
                console.log("delete socket message");
                console.log(data);
                console.log("delete socket message");
            });


            $rootScope.$on('rootScope:subInSamePageAccept', function (event, data) {
                //console.log("sub detail-->",data);
                // console.log($scope.postDetail.Post.provider_id);
                // console.log(data.provider_id);
                // console.log($stateParams.post_id);
                // console.log(data.post_id);
                if (data.provider_id == $scope.postDetail.Post.provider_id && data.post_id == $stateParams.post_id) {
                    $scope.buttonDisable = false;
                    if ($scope.postDetail.User.privacy_setting == true) {
                        $scope.isInfoShown = true;
                    }

                    $scope.buttonText = "I want to Quit";
                    $scope.joinStat = false;
                    $scope.$apply();
                }

            });

            $rootScope.$on('rootScope:subInSamePageReject', function (event, data) {
                /*console.log($scope.postDetail.Post.provider_id);
                 console.log($stateParams.post_id);*/
                if (data.provider_id == $scope.postDetail.Post.provider_id && data.post_id == $stateParams.post_id) {
                    $scope.buttonDisable = true;
                    $scope.isInfoShown = false;
                    $scope.buttonText = "I want to join";
                    $scope.$apply();

                }

            });

            $rootScope.$on('rootScope:refrespostDetail', function (event, data) {
                Crud.create({
                    root: "posts/post_subscriber.json"
                }, {post_id: data}, function (data) {
                    if (data.status) {
                        $scope.postDetail = data.response[0];
                    }
                })
            });


            /*
             
             
             
             var deregister = $ionicPlatform.registerBackButtonAction(
             function () {
             console.log("registerBackButtonAction");
             
             if ($scope.sho0wModel) {
             $scope.sho0wModel = false;
             $scope.mapmodal.hide();
             $scope.modal.remove();
             
             
             } else {
             $ionicHistory.goBack();
             }
             }, 100
             );
             
             // Then when this scope is destroyed, remove the function
             if(! $scope.sho0wModel ){
             $scope.$on('$destroy', deregister);
             }
             */


            $scope.sho0wModel = false;


            $scope.gotoReviews = function () {
                $state.go("green.rateReview")
            };

            $scope.showReviews = function (reviews) {
                $scope.sho0wModel = true;
                $scope.eachPostedObj = reviews;
                $ionicModal.fromTemplateUrl('viewReview.html', {
                    scope: $scope,
                    animation: 'scale-in'
                }).then(function (modal) {
                    $scope.mapmodal = modal;
                    modal.show();
                });


                $scope.closeModal = function () {
                    $scope.mapmodal.hide();
                    $scope.mapmodal.remove();
                };


            };

            $scope.sho0wModel = false;


            $scope.isUserIsOwner = true;
            $scope.isInfoShown = false;
            $scope.joinStat = true;
            $scope.buttonText = "I want to join";
            $scope.buttonDisable = false;
            /*       $scope.showJoin = false;
             $scope.showQuit = false;*/

            //$scope.postDetail = shareDetail.postDetail;
            $scope.postDetail;

            console.log("route param", $stateParams.post_id);

            var history = $ionicViewService.getBackView();

            $scope.$on('$ionicView.beforeEnter', function () {


                console.log(history);

                //http://gd.pacewisdom.com/posts/post_reviews.json

                $scope.enableReview = true;
                $scope.showReviewBubble = false;
                Crud.create({
                    root: "posts/post_reviews.json"
                }, {post_id: $stateParams.post_id}, function (data) {
                    console.log("awesome reviews", data);
                    if (data.status) {
                        if (data.result.Review.length) {
                            $scope.showReviewBubble = true;
                            $scope.reviewLen = data.result.Review.length;
                            $scope.reviewArr = data.result.Review;
                            sharableRateReview.arr = data.result.Review;

                        } else {
                            $scope.enableReview = false;
                        }
                    }
                });


                Crud.create({
                    root: "posts/post_subscriber.json"
                }, {post_id: $stateParams.post_id}, function (data) {
                    if (data.status) {


                        $scope.postDetail = data.response[0];
                        $scope.shareBtn = true;
                        $scope.titleBar = $scope.postDetail.Post.title
                        //console.log("postDetail",$scope.postDetail)

                        var mapDetail = new google.maps.Map(document.getElementById('map_detail'), {
                            center: {
                                lat: parseFloat($scope.postDetail.Post.latitude),
                                lng: parseFloat($scope.postDetail.Post.longitude)
                            },
                            zoom: 17,
                            scrollwheel: false,
                            navigationControl: false,
                            mapTypeControl: false,
                            scaleControl: false,
                            draggable: false,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });

                        var marker = new google.maps.Marker({
                            position: {
                                lat: parseFloat($scope.postDetail.Post.latitude),
                                lng: parseFloat($scope.postDetail.Post.longitude)
                            },
                            map: mapDetail,
                            icon: 'img/marker.png',
                        });

                        if (($scope.postDetail.Post.no_of_slots) == "null" || ($scope.postDetail.Post.no_of_slots) == "0" || ($scope.postDetail.Post.no_of_slots) == "undefined") {
                            $scope.slots = "open for public"
                        } else {
                            $scope.slots = ($scope.postDetail.Post.no_of_slots);
                        }


                        console.log("Post Detail", $scope.postDetail)

                        if ($scope.postDetail.User.privacy_setting == true) {
                            console.log("subscriber list ---->", $scope.postDetail.Subscriber)
                            angular.forEach($scope.postDetail.Subscriber, function (v, k) {

                                if (v.User.user_id == localStorage.user_id && v.status == "accepted") {
                                    $scope.isInfoShown = true;
                                } else {
                                    $scope.isInfoShown = false;
                                }
                            })
                        } else {
                            $scope.isInfoShown = false;
                        }

                        console.log($scope.postDetail);
                        if ($scope.postDetail.Post.costing == "0") {
                            $scope.postDetail.Post.costing = "Free";
                        }

                        $scope.isUserIsOwner = !!(userLogin.isLoggedIn && localStorage.user_id == $scope.postDetail.Post.provider_id);

                        if (userLogin.isLoggedIn && localStorage.user_id != $scope.postDetail.Post.provider_id) {
                            Crud.create({
                                root: "posts/post_status.json"
                            }, {"user_id": localStorage.user_id, "post_id": $scope.postDetail.Post.post_id}, function (data) {
                                console.log("status", data);
                                if (data.status) {
                                    if (data.subscriber.Subscriber.status == "rejected") {
                                        $scope.buttonDisable = true;
                                        $scope.buttonText = "I want to join";
                                        $scope.isInfoShown = false;
                                    } else if (data.subscriber.Subscriber.status == "accepted") {
                                        $scope.buttonDisable = false;
                                        $scope.buttonText = "I want to Quit";
                                        $scope.joinStat = false;
                                        if ($scope.postDetail.User.privacy_setting == true) {
                                            $scope.isInfoShown = true;
                                        }
                                    } else if (data.subscriber.Subscriber.status == "requested") {
                                        $scope.buttonDisable = true;
                                        $scope.buttonText = "Requested";
                                        $scope.isInfoShown = false;
                                    }
                                } else {

                                }
                            })
                        }
                        console.log("this is a post detail page", $scope.postDetail)
                        shareDetail.postDetail = $scope.postDetail;
                        angular.forEach($scope.postDetail.Subscriber, function (a, b) {
                            console.log("kv", a, b)
                            if (userLogin.user_id === a.user_id) {
                                shareDetail.postDetail.Subscriber = {};
                                shareDetail.postDetail.Subscriber.subscriber_id = a.subscriber_id;
                            }
                        })
                    }

                    if (localStorage.user_id == $scope.postDetail.Post.provider_id && $scope.postDetail.Post.post_id == $stateParams.post_id) {
                        $scope.isInfoShown = true;
                    }

                });


                //$ionicViewService
            });

            /*if(localStorage.user_id==$scope.postDetail.Post.provider_id&&$scope.postDetail.Post.post_id==$stateParams.post_id){
             $scope.isInfoShown = true;
             }*/


            console.log("prev page", $scope.prev_page)

            $scope.prev_page = history.stateName;


            //console.log(shareDetail.postDetail);


            function clearHis() {
                navigator.app.clearHistory();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();

            }

            $scope.$on('$ionicView.beforeLeave', function () {
                //navigator.app.clearHistory();
                //$ionicHistory.clearCache();
                //$ionicHistory.clearHistory();
            });

            $scope.openGoogleMaps = function (loc) {
                //console.log("post detail",post)
                window.open('http://maps.google.com/maps?z=15&t=m&q=loc:' + loc, '_system');

            }

            $scope.wantTochat = function () {


                if (userLogin.isLoggedIn) {
                    if (localStorage.email_verify == "1") {
                        var subscribeObj = {};
                        subscribeObj.user_id = localStorage.user_id;
                        subscribeObj.post_id = $scope.postDetail.Post.post_id;
                        subscribeObj.app_id = 1;

                        console.log($scope.postDetail);

                        console.log(subscribeObj);
                        if (subscribeObj.user_id != $scope.postDetail.Post.provider_id) {

                            Crud.create({
                                root: "posts/request_chat.json"
                            }, subscribeObj, function (response) {
                                console.log("chatresponse", response);
                                if (response.status) {
                                    if (new Date($scope.postDetail.Post.end_datetime) < new Date(response.date)) {
                                        $state.go('green.myResponses');
                                        $ionicHistory.clearCache();
                                        $ionicHistory.clearHistory();
                                        $ionicHistory.nextViewOptions({
                                            disableBack: true,
                                            disableAnimate: true,
                                            historyRoot: true
                                        });
                                    } else {
                                        chatData.setChatObj({
                                            "subscriber_id": response.subscriber_id,
                                            "provider_id": $scope.postDetail.Post.provider_id,
                                            "post_id": $scope.postDetail.Post.post_id,
                                            "user_id": localStorage.user_id,
                                            "app_id": $scope.postDetail.Post.app_id,
                                            "user_flag": 0,
                                            "provider_name": $scope.postDetail.User.name,
                                            "subscriber_name": "Me"
                                        });

                                        console.log("the chat obj", chatData.getChatObj())

                                        $state.go("green.chat");


                                    }
                                    //todo


                                } else {

                                }

                            });


                        } else {
                            $ionicPopup.alert({
                                title: "Error",
                                content: "You are Owner of the post"
                            }).then(function (res) {

                            });
                        }
                    } else {
                        $ionicPopup.confirm({
                            title: 'Alert!',
                            content: "your email is not yet verified, if verified please re-login otherwise click 'ok' to resend verification link"
                        }).then(function (res) {
                            if (res) {
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
                            }
                        })
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

            $scope.wantToJQ = function () {


                if (userLogin.isLoggedIn) {
                    if (localStorage.email_verify == "1") {
                        var subscribeObj = {};
                        subscribeObj.user_id = userLogin.user_id;
                        subscribeObj.post_id = $scope.postDetail.Post.post_id;
                        subscribeObj.app_id = 1;

                        console.log(subscribeObj);
                        if (subscribeObj.user_id != $scope.postDetail.Post.provider_id) {

                            if ($scope.joinStat) {
                                Crud.create({
                                    root: "posts/request_post.json"
                                }, subscribeObj, function (response) {
                                    $scope.buttonDisable = true;
                                    console.log("disable button -> ", $scope.buttonDisable);
                                    console.log("resposes -> ", response);
                                    console.log(response);
                                    if (response.status) {
                                        console.log("server date", response.date);
                                        if (new Date($scope.postDetail.Post.end_datetime) < new Date(response.date)) {
                                            $state.go('green.myResponses');
                                            $ionicHistory.clearCache();
                                            $ionicHistory.clearHistory();
                                            $ionicHistory.nextViewOptions({
                                                disableBack: true,
                                                disableAnimate: true,
                                                historyRoot: true
                                            });
                                        }

                                        $scope.buttonDisable = true;
                                        $scope.buttonText = "I Want to Join";
                                        $ionicPopup.alert({
                                            title: "Alert!",
                                            content: "your request has been processed"
                                        }).then(function (res) {

                                        });
                                    } else if (response.error.user_id[0].length > 1) {
                                        $ionicPopup.alert({
                                            title: "Alert!",
                                            content: "your request is under process"
                                        }).then(function (res) {

                                        });
                                    }


                                });
                            } else {
                                Crud.create({
                                    root: "posts/post_exit.json"
                                }, subscribeObj, function (response) {
                                    if (response.status) {
                                        $scope.joinStat = true;
                                        $scope.buttonText = "I want to join";
                                        $scope.buttonDisable = false;
                                    }
                                })
                            }


                        }
                    } else {
                        $ionicPopup.confirm({
                            title: 'Alert!',
                            content: "your email is not yet verified, if verified please re-login otherwise click 'ok' to resend verification link"
                        }).then(function (res) {
                            if (res) {
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
                            }
                        })
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
                //Crud.create({
                //    root: "users/login.json"
                //}, $scope.user, function (response) {
                //
                //
                //});
                //$state.go("green.chat")
            }
        });
