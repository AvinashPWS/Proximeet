angular.module('ionicApp.adminUsersChatListCtrl', [])
        .controller('adminUsersChatListCtrl', function ($scope, userLogin, sharableMyAds, subscribersList, shareDetail, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, Crud, $stateParams, sharableRateReview, hiLightService, $location, chatData, $cordovaSocialSharing) {

            $ionicHistory.clearCache();

            $ionicPlatform.onHardwareBackButton(function () {
                $ionicHistory.goBack();

            }, 100);

            $scope.listGen = function () {

                var sRequestJSON = {
                    admin_id: userLogin.user_id
                };

                Crud.create({
                    root: "chats/adminChatUserList.json"
                }, sRequestJSON, function (response) {

                    console.log("sub", response);

                    if (response.status) {

                        if (response.result.length) {

                            $scope.chatUserList = response.result;

                        } else {

                            $ionicPopup.alert({
                                title: 'Alert!',
                                content: "No chat conversations"
                            }).then(function (res) {

                            });
                        }
                    }
                });

            };

            $scope.gotoChat = function (sItem) {

                if (userLogin.isLoggedIn) {

                    if (userLogin.user_id === localStorage.AdminID || localStorage.email_verify == "1") {

                        //Dont change any key and value

                        chatData.setChatObj({
                            "To": sItem.users.user_id,
                            "subscriber_id": sItem.users.user_id,
                            "provider_id": userLogin.user_id,
                            "post_id": "",
                            "user_id": sItem.users.user_id,
                            "app_id": "1",
                            "flag": 1,
                            "provider_name": "Me",
                            "subscriber_name": sItem.users.name,
                            "AdminChat": true
                        });

                        console.log("the chat obj", chatData.getChatObj());

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

            $scope.$on('$ionicView.beforeEnter', function () {

                $scope.listGen();


                console.log($scope.list);

            });


            $rootScope.$on('rootScope:samePageOwner', function (event, data) {
                //if(data==$stateParams.post_id){
                $ionicHistory.currentView($ionicHistory.backView());
                //$state.transitionTo('green.subscibersList', {post_id: data}, { notify: false });

                if ($scope.list.length) {
                    while ($scope.list.length) {
                        $scope.list.pop();
                    }
                }

                listGen(data);
                $scope.$digest();
                //}

            });

            $rootScope.$on('rootScope:subInSamePageAccept', function (event, data) {
                //if(data==$stateParams.post_id){
                $ionicHistory.currentView($ionicHistory.backView());
                //$state.transitionTo('green.subscibersList', {post_id: data}, { notify: false });

                if ($scope.list.length) {
                    while ($scope.list.length) {
                        $scope.list.pop();
                    }
                }
                listGen(data);
                $scope.$digest();
                //}

            });

            $rootScope.$on('rootScope:subInSamePageNewUser', function (event, data) {
                //if(data==$stateParams.post_id){
                $ionicHistory.currentView($ionicHistory.backView());
                //$state.transitionTo('green.subscibersList', {post_id: data}, { notify: false });

                if ($scope.list.length) {
                    while ($scope.list.length) {
                        $scope.list.pop();
                    }
                }
                setTimeout(function () {
                    listGen(data);
                    $scope.$digest();
                }, 0);

                //}

            });

            $rootScope.$on('rootScope:subInSamePageReject', function (event, data) {
                //if(data==$stateParams.post_id){
                $ionicHistory.currentView($ionicHistory.backView());
                //$state.transitionTo('green.subscibersList', {post_id: data}, { notify: false });

                if ($scope.list.length) {
                    while ($scope.list.length) {
                        $scope.list.pop();
                    }
                }
                listGen(data);
                $scope.$digest();
                //}

            });


            $rootScope.$on('rootScope:hilight', function (event, data) {
                console.log("hilight this user", data);
                listGen(data.post_id);
                $scope.$digest();
            });

        });
