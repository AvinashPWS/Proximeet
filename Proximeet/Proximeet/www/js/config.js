angular.module('ionicApp.config', ['ngCordova'])

        .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $provide) {




            //$httpProvider.defaults.timeout = 10;


            $ionicConfigProvider.views.transition('android');
            $ionicConfigProvider.navBar.transition('android');

            $httpProvider.interceptors.push(function ($rootScope) {
                return {
                    request: function (config) {
                        $rootScope.$broadcast('loading:show');
                        return config
                    },
                    response: function (response) {
                        $rootScope.$broadcast('loading:hide');
                        return response
                    }
                }
            });


            $httpProvider.interceptors.push(function ($q, $cordovaToast) {
                return {
                    request: function (config) {
                        //console.log(config); // Contains the data about the request before it is sent.


                        return config || $q.when(config);
                    },
                    responseError: function (rejection) {
                        if (!eval(localStorage.isInternet)) {
                            $cordovaToast
                                    .show('Internet got disconnected please check your connection.', 'short', 'center')
                                    .then(function (success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });
                            return;
                        }

                        if (rejection.status == 0) {
                            $cordovaToast
                                    .show('Something went wrong please try aftersome time', 'short', 'center')
                                    .then(function (success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });
                            return;
                        } else {
                            $cordovaToast
                                    .show('Something went wrong please try aftersome time', 'short', 'center')
                                    .then(function (success) {
                                        // success
                                    }, function (error) {
                                        // error
                                    });
                            return;
                        }

                        return $q.reject(rejection);
                    }
                };
            });

            //$ionicConfigProvider.views.transition('none');


            $stateProvider
                    .state('green', {
                        url: "/menu",
                        abstract: true,
                        templateUrl: "templates/menu.html",
                        controller: "menuCtrl"


                    })
                    .state('green.login', {
                        url: "/login",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/login.html"

                            }
                        },
                        cache: false
                    })

                    .state('green.init', {
                        url: "/init",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/init.html",
                                controller: "initCtrl"

                            }
                        },
                        cache: false
                    })


                    .state('green.search', {
                        url: "/search",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/search.html",
                            }
                        },
                        cache: false
                    })
                    .state('green.category', {
                        url: "/category",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/category.html",
                                controller: "categorySearchCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.myAds', {
                        url: "/myAds",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/myAds.html"


                            }
                        },
                        cache: false
                    })
                    .state('green.myFavorites', {
                        url: "/myFavorites",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/myFavorites.html",
                                controller: "myFavoritesCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.myResponses', {
                        url: "/myResponses",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/myResponses.html"

                            }
                        }
                    })
                    .state('green.subscibersList', {
                        url: "/subscibersList/:post_id",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/subscibersList.html"

                            }
                        },
                        cache: false
                    })
                    .state('green.upcomingEvent', {
                        url: "/upcomingEvent",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/upcomingEvent.html",
                                controller: "upcomingEventCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.editPost', {
                        url: "/editPost",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/editPost.html",
                                controller: "editPostCtrl"

                            }
                        },
                        cache: false
                    })

                    .state('green.detail', {
                        url: "/detail/:post_id",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/postDetail.html",
                                controller: "postDetailCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.introSlider', {
                        url: "/slider",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/introSlider.html",
                                controller: "introSliderCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.review', {
                        url: "/review",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/review.html",
                                controller: "reviewCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.feedback', {
                        url: "/feedback",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/feedback.html",
                                controller: "feedbackCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.proApp', {
                        url: "/proApp",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/proApp.html",
                                controller: "proAppCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.settings', {
                        url: "/settings",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/settings.html",
                                controller: "settingsCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.help', {
                        url: "/help",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/help.html",
                                controller: "helpCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.profile', {
                        url: "/profile",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/profileSettings.html"
                            }
                        },
                        cache: false
                    })
                    .state('green.chat', {
                        url: "/chat",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/chat.html",
                                controller: 'chatCtrl'
                            }
                        },
                        cache: false
                    })
                    .state('green.notification', {
                        url: "/notification",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/notificationSettings.html",
                                controller: "notificationSettingsCtrl"
                            }
                        },
                        cache: false
                    })
                    .state('green.pwd', {
                        url: "/pwd",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/pwdSettings.html",
                                controller: "pwdSettingsCtrl"
                            }
                        },
                        cache: false
                    })

                    .state('green.privacy', {
                        url: "/privacy",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/privacySettings.html",
                                controller: "privacySettingsCtrl"
                            }
                        },
                        cache: false
                    })
                    .state('green.post', {
                        url: "/post",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/post.html",
                                controller: "postCtrl"
                            }
                        },
                        cache: false
                    })
                    .state('green.reg', {
                        url: "/reg",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/register.html",
                                controller: "regCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.list', {
                        url: "/list",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/searchList.html",
                                controller: "searchListCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.rateReview', {
                        url: "/rateReview",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/rateReview.html",
                                controller: "rateReviewCtrl"

                            }
                        },
                        cache: false
                    })


                    .state('green.threeMenu', {
                        url: "/threeMenu",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/threeMenu.html",
                                controller: "threeMenuCtrl"

                            }
                        },
                        cache: false
                    })

                    .state('green.userAdProfile', {
                        url: "/userAdProfile/:user_id",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/userAdProfile.html",
                                controller: "userAdProfileCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.forgot', {
                        url: "/forgot",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/forgot.html",
                                controller: "forgotCtrl"

                            }
                        },
                        cache: false
                    })
                    .state('green.adminUsersChatList', {
                        url: "/adminUsersChatList",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/adminUsersChatList.html",
                                controller: "adminUsersChatListCtrl"

                            }
                        },
                        cache: false
                    })

            $urlRouterProvider.otherwise("/menu/init");
        })

        .run(function ($window, $rootScope, $ionicLoading, $ionicPlatform
                , $ionicPopup, $cordovaPush, $cordovaDevice, Crud, userLogin, $state, $ionicHistory, shareDetail, socket,
                hiLightService, $cordovaDialogs, chatData, $stateParams) {

//            $rootScope.ROUTES = "http://78.47.154.117/production/greendiamond/";
            
            $rootScope.ROUTES = "http://78.47.154.117/greendiamond/";

            $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        sessionStorage.current = toState.name;
                    });


            localStorage.notificationDelay = 5000;


            $rootScope.$on('onPauseCordova', function (event) {
                console.log("okay delete socket");
                //if($state.current.name = "green.chat"){
                if (sessionStorage.current == "green.chat") {
                    socket.emit('disconnect1', {"user_id": userLogin.user_id}, function (data) {
                        console.log("delete socket message");
                        console.log(data);
                        console.log("delete socket message");
                    });
                }

                //}

            });
            $rootScope.$on('onResumeCordova', function (event) {

                //if ($state.current.name == "green.chat") {
                if (sessionStorage.current == "green.chat") {
                    socket.emit('new user', {'user_id': userLogin.user_id}, function (data) {
                        console.log("from socket");
                        console.log(data);
                        console.log("from socket");
                    });
                }
                //}


            })


            $rootScope.$on('loading:show', function () {
                $ionicLoading.show({
                    //template: '<div class="default-loader"><ion-spinner icon="ripple"></ion-spinner></div>'
                    template: '<div class="default-loader"><img class="loading_gif" src="img/loader.gif"></div>'
                });
                // $ionicLoading.show({template: '<ion-spinner icon="android" class="spinner spinner-android"><svg viewBox="0 0 64 64"><g transform="rotate(53.30000000000001,32,32)"><circle stroke-width="6" stroke-dasharray="154.92432199544834" stroke-dashoffset="78.21080350295858" r="26" cx="32" cy="32" fill="none" transform="scale(1,1) translate(0,0) rotate(-270,32,32)"></circle></g></svg></ion-spinner>'})
            });

            $rootScope.$on('loading:hide', function () {
                $ionicLoading.hide();
            });


            $rootScope.online = navigator.onLine;

            $window.addEventListener("offline", function () {
                $rootScope.$apply(function () {
                    $rootScope.online = false;
                });
            }, false);
            $window.addEventListener("online", function () {
                $rootScope.$apply(function () {
                    $rootScope.online = true;
                });
            }, false);

            $rootScope.$watch('online', function (newStatus) {
                if (!newStatus) {
                    localStorage.isInternet = false;
                    $cordovaDialogs.alert('Internet is disconnected', 'Alert', 'Okay')
                            .then(function () {
                                // callback success
                            });

                } else {
                    localStorage.isInternet = true;
                    //$rootScope.$emit('rootScope:reconnect', eval(localStorage.isInternet));
                }

            });

            /*    $rootScope.online = navigator.onLine;
             $window.addEventListener("offline", function () {
             $rootScope.$apply(function () {
             $rootScope.online = false;
             $ionicLoading.hide();
             $ionicPopup.alert({
             title: "Internet Disconnected",
             content: "The internet is disconnected on your device."
             }).then(function (result) {
             // ionic.Platform.exitApp();\
             //navigator.app.exitApp();
             
             });
             });
             }, false);
             $window.addEventListener("online", function () {
             $rootScope.$apply(function () {
             $rootScope.online = true;
             });
             }, false);*/


            //$ionicPlatform.ready(function () {
            //    if (window.Connection) {
            //        if (navigator.connection.type == Connection.NONE) {
            //            $ionicPopup.confirm({
            //                title: "Internet Disconnected",
            //                content: "The internet is disconnected on your device."
            //            })
            //                .then(function (result) {
            //                    if (!result) {
            //                        ionic.Platform.exitApp();
            //                    } else {
            //                        ionic.Platform.exitApp();
            //                    }
            //                });
            //        }
            //    }
            //
            //
            //});


            $ionicPlatform.ready(function () {
                localStorage.uuid = $cordovaDevice.getUUID()
                sessionStorage.uuid = $cordovaDevice.getUUID()

                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }

                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                var push = PushNotification.init({
                    "android": {"senderID": "169098113765", "icon": "www/image/ionic.png", "iconColor": "grey"},
                    "ios": {"alert": "true", "badge": "true", "sound": "true"}, "windows": {}
                });

                push.on('registration', function (data) {
                    console.log("reg", data);
                    localStorage.reg = data.registrationId;
                    sessionStorage.reg = data.registrationId;
                });

                push.on('notification', function (notification) {
                    console.log("notification from server", notification);
                    setTimeout(function () {
                        switch (notification.title) {
                            case "Join Request":
                            case "Chat Request":
                                //todo 1. chat req 2.join pro accept 3.reject by sub then sub chat no notification to provider
                                console.log("new joinee", notification);
                                if (notification.additionalData.provider_id == localStorage.user_id) {

                                    console.log("current name", $state.current.name);

                                    console.log("current name post", $stateParams.post_id);
                                    if ($state.current.name == "green.subscibersList") {
                                        if ($stateParams.post_id == notification.additionalData.post_id) {
                                            console.log("provider in the subscribers page of same ad");
                                            $rootScope.$broadcast('rootScope:subInSamePageNewUser', notification.additionalData.post_id);
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });
                                        } else {
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });
                                        }
                                    } else {
                                        console.log("provider in diff page");
                                        $cordovaDialogs.confirm(notification.message, notification.title, ["Let's see", "Cancel"])
                                                .then(function (data) {
                                                    console.log(data);
                                                    if (data == 1) {
                                                        $state.go('green.subscibersList', {post_id: notification.additionalData.post_id});
                                                    }

                                                });
                                    }

                                }
                                // this is for provider
                                else {

                                    $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                            .then(function () {

                                            });


                                }


                                break;
                                /* case "Chat Request":
                                 console.log("new chat req", notification);
                                 if (notification.additionalData.provider_id == localStorage.user_id) {
                                 //same page of that ad //refresh required
                                 if ($state.current.name == 'green.subscibersList' && $stateParams.post_id == notification.additionalData.post_id) {
                                 //broad cast here
                                 $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                 .then(function () {
                                 
                                 });
                                 }
                                 //ad by same user but in different page
                                 else {
                                 $cordovaDialogs.confirm(notification.message, notification.title, ["Let's see","Cancel"])
                                 .then(function () {
                                 
                                 });
                                 }
                                 
                                 }
                                 break;*/
                            case "Exit Request":
                                console.log("exit req", notification);
                                if (notification.additionalData.provider_id == localStorage.user_id) {
                                    //same page of that ad //refresh required
                                    if ($state.current.name == 'green.subscibersList' && $stateParams.post_id == notification.additionalData.post_id) {
                                        //broad cast here
                                        $rootScope.$broadcast('rootScope:subInSamePageReject', notification.additionalData);
                                        $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                .then(function () {

                                                });
                                    }
                                    //ad by same user but in different page
                                    else {
                                        $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                .then(function () {

                                                });
                                    }

                                }
                                break;
                            case "Request Confirmation":
                                console.log("req conf", notification);
                                //subscriber
                                if (notification.additionalData.provider_id != localStorage.user_id) {
                                    //same page of subscribed ad
                                    if ($state.current.name == 'green.detail') {
                                        //broad cast here
                                        if ($stateParams.post_id == notification.additionalData.post_id) {
                                            $rootScope.$broadcast('rootScope:subInSamePageAccept', notification.additionalData);
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });
                                        } else {
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });
                                        }

                                    }
                                    //subscriber of an ad
                                    else {
                                        $cordovaDialogs.confirm(notification.message, notification.title, ["Let's see", "Cancel"])
                                                .then(function (data) {
                                                    if (data == 1) {
                                                        $state.go('green.detail', {post_id: notification.additionalData.post_id});
                                                    }
                                                });
                                    }

                                }
                                break;
                            case "Reject Confirmation":
                                console.log("reject conf", notification);
                                //subscriber
                                if (notification.additionalData.provider_id != localStorage.user_id) {
                                    //same page of subscribed ad
                                    if ($state.current.name == 'green.detail') {
                                        //broad cast here
                                        if ($stateParams.post_id == notification.additionalData.post_id) {
                                            $rootScope.$broadcast('rootScope:subInSamePageReject', notification.additionalData);
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });
                                        } else {
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });
                                        }

                                    }
                                    //subscriber of an ad
                                    else {
                                        $cordovaDialogs.confirm(notification.message, notification.title, ["Let's see", "Cancel"])
                                                .then(function (data) {
                                                    if (data == 1) {
                                                        $state.go('green.detail', {post_id: notification.additionalData.post_id});
                                                    }
                                                });
                                    }

                                }
                                break;
                            case "Event Delete":
                                console.log("Event Delete", notification);
                                if (notification.additionalData.provider_id != localStorage.user_id) {
                                    //same chat page or post detail page of subscribed ad
                                    if (($state.current.name == 'green.detail' && $stateParams.post_id == notification.additionalData.post_id) ||
                                            ($state.current.name == 'green.chat' && chatData.getChatObj()["post_id"] == notification.additionalData.post_id)
                                            || ($state.current.name == 'green.myResponses')) {
                                        //redirect user to home
                                        $state.go('green.search');
                                        $ionicHistory.clearCache();
                                        $ionicHistory.clearHistory();
                                        $ionicHistory.nextViewOptions({
                                            disableBack: true
                                        });
                                        $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                .then(function () {

                                                });
                                    }
                                    //don't do anything
                                    else {
                                        $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                .then(function () {

                                                });
                                    }

                                }
                                break;
                            case "Event Updation":
                                console.log("Event Updation", notification);
                                if (notification.additionalData.provider_id != localStorage.user_id) {
                                    if (($state.current.name == 'green.detail' && $stateParams.post_id == notification.additionalData.post_id)) {
                                        $rootScope.$broadcast('rootScope:refrespostDetail', notification.additionalData.post_id);
                                        $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                .then(function () {

                                                });
                                    } else {
                                        console.log("diff")
                                        $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                .then(function () {

                                                });
                                    }


                                }
                                break;
                            case "Event Start":
                                console.log("Event Start", notification);
                                $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                        .then(function () {

                                        });
                                break;
                            case "Event Close":
                                console.log("Event Close", notification);
                                $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                        .then(function () {

                                        });
                                break;
                            case "New Message":
                                console.log("new message", notification);
                                if (notification.additionalData.provider_id == localStorage.user_id) {
                                    //this part is for provider
                                    if ($state.current.name == "green.chat") {
                                        //provider in chat page
                                        if (notification.additionalData.post_id == chatData.getChatObj()["post_id"] && notification.additionalData.subscriber_id == chatData.getChatObj()["subscriber_id"]) {
                                            //push message broadcast then alert
                                            $rootScope.$broadcast('rootScope:pushNewMessage', notification);
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });

                                        } else {
                                            //do not broadcast but show alert
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });
                                        }
                                    } else {
                                        if (!hiLightService.hiLightArr.hasOwnProperty(notification.additionalData.post_id)) {
                                            hiLightService.hiLightArr[notification.additionalData.post_id] = {};
                                            if (!hiLightService.hiLightArr[notification.additionalData.post_id].hasOwnProperty(notification.additionalData.subscriber_id)) {
                                                hiLightService.hiLightArr[notification.additionalData.post_id][notification.additionalData.subscriber_id] = notification.additionalData;
                                            }
                                        } else if (!hiLightService.hiLightArr[notification.additionalData.post_id].hasOwnProperty(notification.additionalData.subscriber_id)) {
                                            hiLightService.hiLightArr[notification.additionalData.post_id][notification.additionalData.subscriber_id] = notification.additionalData;
                                        }

                                        console.log(hiLightService.hiLightArr)

                                        if ($state.current.name == 'green.subscibersList' && $stateParams.post_id == notification.additionalData.post_id) {
                                            $rootScope.$broadcast('rootScope:hilight', hiLightService.hiLightArr[notification.additionalData.post_id][notification.additionalData.subscriber_id])
                                        }
                                        //provider in diff page
                                        $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                .then(function () {

                                                });
                                    }
                                } else {
                                    //subscriber part
                                    if ($state.current.name == "green.chat") {
                                        if (notification.additionalData.subscriber_id == chatData.getChatObj()["subscriber_id"]) {
                                            $rootScope.$broadcast('rootScope:pushNewMessage', notification);
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });
                                        } else {
                                            $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                    .then(function () {

                                                    });
                                        }
                                    } else {
                                        $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                                .then(function () {

                                                });
                                    }

                                }
                                break;
                            case "User Review":
                                console.log("User Review", notification);
                                $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                        .then(function () {

                                        });
                                break;
                            case "Event Updation":
                                console.log("Event Updation", notification);
                                $cordovaDialogs.alert(notification.message, notification.title, 'OK')
                                        .then(function () {

                                        });
                                break;

                        }
                    }, localStorage.notificationDelay)

                });


            });


            /*    var androidConfig = {
             "senderID": "169098113765"
             };
             
             document.addEventListener("deviceready", function () {
             console.log($cordovaDevice.getUUID())
             localStorage.uuid = $cordovaDevice.getUUID()
             sessionStorage.uuid = $cordovaDevice.getUUID()
             
             $cordovaPush.register(androidConfig).then(function (result) {
             // Success
             
             console.log(result);
             }, function (err) {
             
             // Error
             })
             
             $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
             //console.log("this is notification Obj",notification)
             switch (notification.event) {
             case 'registered':
             if (notification.regid.length > 0) {
             //                            alert('registration ID = ' + notification.regid);
             localStorage.reg = notification.regid;
             sessionStorage.reg = notification.regid;
             }
             break;
             
             case 'message':
             // this is the actual push notification. its format depends on the data model from the push server
             
             
             //alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
             console.log($state.current);
             //console.log("event", event);
             console.log("nitification", notification);
             
             if ($state.current.name == "green.chat" && ((notification.payload.provider_id == shareDetail.postDetail.Post.provider_id) || (notification.payload.subscriber_id == shareDetail.postDetail.Subscriber.subscriber_id)) && shareDetail.postDetail.Post.post_id == notification.payload.post_id) {
             $rootScope.$broadcast('rootScope:pushNewMessage', notification);
             }
             
             setTimeout(function () {
             if (notification.payload.title != "offer_complete" && notification.payload.title != "login" && notification.payload.title != "delete_post" && notification.payload.title != "reject_post" && notification.payload.title != "accept_post" && !($state.current.name == "green.chat" && ((notification.payload.provider_id == shareDetail.postDetail.Post.provider_id) || (notification.payload.subscriber_id == shareDetail.postDetail.Subscriber.subscriber_id)) && shareDetail.postDetail.Post.post_id == notification.payload.post_id)) {
             
             var ButtonArr = ["", "Let's See", "Maybe Later"];
             //console.log("1---->",notification,notification.payload.provider,userLogin.user_id);
             if (notification.payload.title == "request" && eval(notification.payload.provider) != userLogin.user_id) {
             //console.log("2---->",notification,notification.payload.provider,userLogin.user_id);
             ButtonArr = ["Okay"];
             }
             
             navigator.notification.confirm(notification.message, function (buttonIndex) {
             switch (buttonIndex) {
             case 2:
             console.log("pressed see");
             
             
             var notifiactionObj = {};
             if ($state.current.name == "green.chat" && ((notification.payload.provider_id != shareDetail.postDetail.Post.provider_id) || (notification.payload.subscriber_id != shareDetail.postDetail.Subscriber.subscriber_id))) {
             notifiactionObj.notification = notification;
             notifiactionObj.isChatDiff = true;
             } else {
             notifiactionObj.notification = notification;
             notifiactionObj.isChatDiff = false;
             }
             
             $rootScope.$broadcast('rootScope:broadcast', notifiactionObj);
             
             break;
             case 3:
             console.log("Pressed later");
             
             if (notification.payload.title == "New Message"&&notification.payload.provider_id == localStorage.user_id) {
             
             hiLightService.hiLightArr.push(notification.payload);
             var cnt = 0;
             angular.forEach(hiLightService.hiLightArr,function(a,b){
             if(a.subscriber_id==notification.payload.subscriber_id){
             cnt++;
             }
             if(a.subscriber_id==notification.payload.subscriber_id&&cnt>1){
             hiLightService.hiLightArr.splice(b,1)
             }
             })
             console.log(hiLightService.hiLightArr)
             if($state.current.name == 'green.subscibersList'){
             console.log("broadcastinggg.")
             $rootScope.$broadcast('rootScope:hilight', notification.payload.post_id)
             }
             
             ;
             
             }
             
             break;
             default:
             if (notification.payload.title == "New Message"&&notification.payload.provider_id == localStorage.user_id) {
             hiLightService.hiLightArr.push(notification.payload)
             console.log(hiLightService.hiLightArr)
             }
             break;
             
             }
             }, notification.payload.title, ButtonArr);
             } else {
             navigator.notification.confirm(notification.message, function (buttonIndex) {
             switch (buttonIndex) {
             case 0:
             
             
             break;
             
             
             }
             }, notification.payload.title, ["Okay"]);
             }
             
             }, localStorage.notificationDelay);
             
             
             break;
             
             case 'error':
             alert('GCM error = ' + notification.msg);
             break;
             
             default:
             alert('An unknown GCM event has occurred');
             break;
             }
             });
             
             
             }, false);*/


        });

