

angular.module('ionicApp.helpCtrl', [])
        .controller('helpCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, Crud, $cordovaSocialSharing, chatData) {
            $scope.name = $state.current.name;

            $scope.gotoIntroSlider = function () {
                localStorage.showSkipIntroBtn = false;
                localStorage.isIntroOver = false;
                window.location.href = "#/slider";
            };


            $scope.gotoChat = function () {
                $state.go("green.chat");
            };

            $scope.showAdminChat = userLogin.user_id === localStorage.AdminID ? false : true;

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

            $scope.shareNow = function () {
                $cordovaSocialSharing
//                        .share("this is a simple message ", "The Subject", "", "http://google.co.in") // Share via native share sheet
                        .share("Enroll, Schedule events and come together in your proximity.", "Share events through Proximeet", "", "https://play.google.com/store/apps/details?id=com.imagineit.proximeet&hl=en") // Share via native share sheet
                        .then(function (result) {
                            // Success!


                        }, function (err) {
                            // An error occured. Show a message to the user
                        });
            }
            $scope.addNewCategory = function () {
                $scope.data = {}
                var myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="data.category" placeholder="Name of the category">',
                    title: 'Request new category',
                    subTitle: 'Enter your Category Name Below',
                    scope: $scope,
                    buttons: [
                        {text: 'Cancel'},
                        {
                            text: '<b>Send</b>',
                            type: 'button-positive button-theme ',
                            onTap: function (e) {
                                if (!$scope.data.category) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    return $scope.data.category;
                                }
                            }
                        }
                    ]
                });
                myPopup.then(function (res) {
                    if (res) {
                        if (localStorage.user_id) {
                            console.log({"user_id": localStorage.user_id, "name": res})
                            Crud.create({root: "categories/request_category.json"}, {"user_id": localStorage.user_id, "name": res}, function (response) {
                                console.log(response)
                                if (response.status) {
                                    $ionicPopup.alert({
                                        title: 'Success',
                                        template: "<h6>" + response.message + "</h6>"
                                    }).then(function (res) {

                                    })
                                } else {
                                    $ionicPopup.alert({
                                        title: 'Alert',
                                        template: "<h6>" + response.message.parent_id[0] + "</h6>"
                                    }).then(function (res) {

                                    })
                                }
                            });
                        } else {
                            $ionicPopup.alert({
                                title: 'Alert',
                                template: "<h6>Please login to continue</h6>"
                            }).then(function (res) {

                            })
                        }

                    }
                });
            };

            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicPlatform.registerBackButtonAction(function () {


                if (!userLogin.isLoggedIn) {
                    if ($state.current.name == "green.help") {
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
                    if ($state.current.name == "green.help") {
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


        })
