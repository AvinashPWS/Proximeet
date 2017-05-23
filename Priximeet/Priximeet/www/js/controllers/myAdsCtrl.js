angular.module('ionicApp.myAdsCtrl', [])
    .controller('myAdsCtrl', function (sharablePostedAd, $ionicActionSheet, $scope, sharableMyAds, userLogin, subscribersList, Crud, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, shareDetail,$cordovaToast) {

    $scope.serverTime = undefined;

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
        }


        //$ionicHistory.clearCache();
        //$ionicHistory.clearHistory();
        //
        //$ionicPlatform.registerBackButtonAction(function () {
        //
        //    if (userLogin.isLoggedIn) {
        //        navigator.app.clearHistory();
        //        $ionicHistory.clearCache();
        //        $ionicHistory.clearHistory();
        //        $ionicPopup.confirm({
        //            title: "Exiting app",
        //            template: 'Are you sure you want to Exit?'
        //        }).then(function (res) {
        //            if (res) {
        //                navigator.app.exitApp();
        //            } else {
        //                navigator.app.clearHistory();
        //                $ionicHistory.clearCache();
        //                $ionicHistory.clearHistory();
        //            }
        //        })
        //    }
        //
        //
        //}, 100);

        //

        $scope.showLoginError = true;
        $scope.$on('$ionicView.beforeEnter', function () {
            //navigator.app.clearHistory();
            //$ionicHistory.clearCache();
            //$ionicHistory.clearHistory();
            console.log(history.stateName);
            if (!userLogin.isLoggedIn) {
                $scope.showLoginError = true;
            }
            else {
                $scope.showLoginError = false;
                makeReq();
            }


        });

        $scope.checkDate = function (end_datetime) {
            var  timeFinal = end_datetime;
          /*console.log("time from server",time)
            if(eval(end_datetime)){
                timeFinal = time;
            }else{
                timeFinal ="23:59:59"
            }*/

          /*console.log("post end date" , new Date(date+" "+timeFinal));
          console.log("server   date" , new Date($scope.serverTime));*/

  /*        console.log(new Date(timeFinal)<new Date($scope.serverTime))
          console.log(new Date(timeFinal))
          console.log(new Date($scope.serverTime))*/

            if(new Date(timeFinal)<new Date($scope.serverTime)){
                return true;
            }else{
                return false;
            }
        }

        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicPlatform.registerBackButtonAction(function () {


            if (!userLogin.isLoggedIn) {
                if ($state.current.name == "green.myAds") {
                    navigator.app.clearHistory();
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $state.go('green.login');

                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        disableAnimate: true
                    });
                }


            }
            else {
                if ($state.current.name == "green.myAds") {
                    $ionicPopup.confirm({
                        title: "Exiting app",
                        template: 'Are you sure you want to Exit?'
                    }).then(function (res) {
                        if (res) {
                            navigator.app.exitApp();
                        }
                        else {
                            navigator.app.clearHistory();
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                        }
                    })
                }
            }


        }, 100);

        function makeReq() {
//                 console.log($scope.list);
            if (userLogin.user_id != "") {
                var myAdsObj = {};
                myAdsObj.user_id = userLogin.user_id;
                console.log(myAdsObj);
                Crud.create({
                    root: "users/my_posts.json"
                }, myAdsObj, function check(response) {
                    console.log(response)
                    if (response.message = "success") {
                      $scope.serverTime = response.date;
                        $scope.emptyArr = false;
                        //$scope.todos.unshift({name: 'Incoming todo ' + Date.now()})
                        console.log("myads ",response);
                        if( response.result.post){
                            $scope.list = response.result.post.reverse();
                        }else{
                          if($scope.list){
                            while($scope.list.length){
                              $scope.list.pop();
                            }
                          }

                          $cordovaToast
                            .show('No Events to display.', 'short', 'center')
                            .then(function(success) {
                              // success
                            }, function (error) {
                              // error
                            });
                        }
//                        console.log($scope.list);
                    }
                });
            }

        }


        $scope.doRefresh = function () {
            makeReq();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply()
        };


        $scope.gotoListOfSubscribes = function (obj, myPosts) {
            console.log("go to list of subscribers");
            sharableMyAds.post = myPosts;
            var subscribeObj = {};
            subscribeObj.post_id = obj;
            console.log(subscribeObj);
            Crud.create({
                root: "posts/post_subscriber.json"
            }, subscribeObj, function check(response) {
                console.log(response);
                if (response.status) {
                    subscribersList.listSubscribers = response.response[0].Subscriber;
                    //console.log(subscribersList.listSubscribers);

                    //searcPosts

                    console.log("Goto list of subscribers");
                    $state.go('green.subscibersList',{post_id:subscribeObj.post_id});
                    $ionicHistory.nextViewOptions({
                        disableBack: false,
                        disableAnimate: true
                    });

                }
            });
        }

        $scope.eachPostedObj = {};

        $scope.showOptions = function (postObj, postIndex) {
            $scope.changeSwitch = !!$scope.checkDate(postObj.end_datetime);


            $scope.eachPostedObj = postObj;
            if(($scope.eachPostedObj.no_of_slots)=="null" || ($scope.eachPostedObj.no_of_slots)=="0"||($scope.eachPostedObj.no_of_slots)=="undefined" ){
              $scope.eachPostedObj.no_of_slots = "open for public"
            }else{
              $scope.eachPostedObj.no_of_slots = ($scope.eachPostedObj.no_of_slots);
            }

            $ionicActionSheet.show({
                buttons: ($scope.checkDate(postObj.end_datetime))?[

                    {text: '<i class="icon ion-android-delete theme-icon"></i>Delete'},
                    {text: '<i class="icon ion-eye theme-icon"></i>View this Ad'}
                ]:[
                    {text: '<i class="icon ion-edit theme-icon"></i>Edit Post'},
                    {text: '<i class="icon ion-android-delete theme-icon"></i>Delete'},
                    {text: '<i class="icon ion-eye theme-icon"></i>View this Ad'}
                ],
                // destructiveText: 'Delete',
                // cancelText: 'Cancel',
                buttonClicked: function (index) {
                    //alert(index);
                    if( $scope.changeSwitch){
                        switch (index) {

                            case 0:
                                console.log("deleting a post");
                              $ionicPopup.confirm({
                                title: "Alert",
                                content: "Are you sure? You want to remove from your Events List?"
                              }).then(function (res) {
                                if(res){
                                  Crud.create({
                                    root: "posts/delete_post.json"
                                  }, {"post_id": postObj.post_id}, function check(response) {

                                    console.log(response);
                                    if (response.status) {
                                      $scope.list.splice(postIndex, 1);
                                    }

                                  })
                                }});

                                break;
                            case 1:


                                $ionicModal.fromTemplateUrl('viewPostedAd.html', {
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


                                $ionicPlatform.on('backbutton', function (e) {
                                    $scope.mapmodal.hide();
                                    $scope.mapmodal.remove();
                                });

                                break;

                        }
                    }else{
                        switch (index) {
                            case 0:

                                console.log(postObj)
                                sharablePostedAd.post = postObj;
                                $state.go("green.editPost")

                                break;
                            case 1:
                                console.log("deleting a post");
                              $ionicPopup.confirm({
                                title: "Alert",
                                content: "Are you sure? You want to remove from your Events List?"
                              }).then(function (res) {
                                if(res) {
                                  Crud.create({
                                    root: "posts/delete_post.json"
                                  }, {"post_id": postObj.post_id}, function check(response) {

                                    console.log(response);
                                    if (response.status) {
                                      $scope.list.splice(postIndex, 1);
                                    }

                                  })
                                }})

                                break;
                            case 2:


                                $ionicModal.fromTemplateUrl('viewPostedAd.html', {
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


                                $ionicPlatform.on('backbutton', function (e) {
                                    $scope.mapmodal.hide();
                                    $scope.mapmodal.remove();
                                });

                                break;

                        }
                    }


                    return true;
                }
            });

        };

    });
