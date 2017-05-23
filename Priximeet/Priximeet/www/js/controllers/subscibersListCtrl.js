angular.module('ionicApp.subscibersListCtrl', [])
    .controller('subscibersListCtrl', function ($scope, userLogin, sharableMyAds, subscribersList, shareDetail, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, Crud,$stateParams,sharableRateReview,hiLightService,$location,chatData,$cordovaSocialSharing) {
        $ionicHistory.clearCache();
        $ionicPlatform.onHardwareBackButton(function () {
            $ionicHistory.goBack();

        }, 100);

        $scope.gotoReviews = function () {
            $state.go("green.rateReview")
        };





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



            //$ionicViewService
        });


        //console.log(sharableMyAds.post);

        //$scope.detailSub = sharableMyAds.post;
    //console.log("detail sub",$scope.detailSub)

    function listGen (id){

      Crud.create({
        root: "posts/post_subscriber.json"
      }, {post_id:id}, function check(response) {
        console.log("sub",response);
        if (response.status) {

          if(response.response.length){
            subscribersList.listSubscribers = response.response[0].Subscriber;
            delete $scope.list;
            $scope.list = response.response[0].Subscriber;
            $scope.detailSub = response.response[0].Post;

            $scope.postendson = response.response[0].Post.end_datetime;
            $scope.catImg = response.response[0].Category.file_path;
          }



          //$scope.$apply();
        }
      });


    }

        $scope.$on('$ionicView.beforeEnter', function () {
            //console.log(subscribersList.listSubscribers);

            console.log("route param", $stateParams.post_id);

          listGen($stateParams.post_id);



            console.log($scope.list)
        });


    $rootScope.$on('rootScope:samePageOwner', function (event,data) {
      //if(data==$stateParams.post_id){
      $ionicHistory.currentView($ionicHistory.backView());
      //$state.transitionTo('green.subscibersList', {post_id: data}, { notify: false });

      if($scope.list.length){
        while($scope.list.length){
          $scope.list.pop();
        }
      }

        listGen (data);
        $scope.$digest();
      //}

    });

    $rootScope.$on('rootScope:subInSamePageAccept', function (event,data) {
      //if(data==$stateParams.post_id){
      $ionicHistory.currentView($ionicHistory.backView());
      //$state.transitionTo('green.subscibersList', {post_id: data}, { notify: false });

      if($scope.list.length){
        while($scope.list.length){
          $scope.list.pop();
        }
      }
      listGen (data);
      $scope.$digest();
      //}

    });

    $rootScope.$on('rootScope:subInSamePageNewUser', function (event,data) {
      //if(data==$stateParams.post_id){
      $ionicHistory.currentView($ionicHistory.backView());
      //$state.transitionTo('green.subscibersList', {post_id: data}, { notify: false });

      if($scope.list.length){
        while($scope.list.length){
          $scope.list.pop();
        }
      }
      setTimeout(function(){
        listGen (data);
        $scope.$digest();
      },0);

      //}

    });

    $rootScope.$on('rootScope:subInSamePageReject', function (event,data) {
      //if(data==$stateParams.post_id){
      $ionicHistory.currentView($ionicHistory.backView());
      //$state.transitionTo('green.subscibersList', {post_id: data}, { notify: false });

      if($scope.list.length){
        while($scope.list.length){
          $scope.list.pop();
        }
      }
      listGen (data);
      $scope.$digest();
      //}

    });


    $rootScope.$on('rootScope:hilight', function (event,data) {
      console.log("hilight this user",data)
      listGen (data.post_id);
      $scope.$digest();
    });

        //console.log(subscribersList.listSubscribers);
        $scope.accept = function (obj) {
            var acceptObj = {};
            acceptObj.subscriber_id = obj.subscriber_id;
            acceptObj.post_id = obj.subscriber_id;
            acceptObj.app_id = obj.app_id;
            acceptObj.user_id = userLogin.user_id;
            console.log(acceptObj);
        };
        $scope.reject = function (obj) {
            console.log("clicked reject")
        };


    $scope.shareMyEvent  = function(){
      console.log($scope.postDetail);


      var message = "Hi, check this event '" +$scope.detailSub.title + "' in ProxiMeet app. Please download the app from Google store (link attached), and you can subscribe to the event";



      $cordovaSocialSharing
        .share(message, "I have created an event from Proximeet", "", "https://play.google.com/store/apps/details?id=com.imagineit.proximeet") // Share via native share sheet
        .then(function (result) {
          // Success!


        }, function (err) {
          // An error occured. Show a message to the user
        });
    };

       /* $scope.prepareObjAndChat = function (obj) {


            //console.log(obj);

            Crud.create({
                root: "posts/subscriber_status.json"
            }, {"subscriber_id": obj.subscriber_id}, function check(statData) {
                console.log(statData);
                if (statData.status) {
                    shareDetail.postDetail = {
                        Subscriber: {
                            subscriber_id: obj.subscriber_id,
                            subscriber_name: obj.User.name,
                            subscriber_status: statData.subscriber_status
                        },
                        Post: {
                            post_id: obj.post_id,
                            app_id: obj.app_id,
                            provider_id: userLogin.user_id,
                            post_actual_id: obj.User.user_id
                        }
                    };
                    $state.go("green.chat");
                }
            });


            //console.log(shareDetail);
            //shareDetail.postDetail.Subscriber.subscriber_id = obj.subscriber_id;
            //shareDetail.postDetail.Post.post_id = obj.post_id;
            //shareDetail.postDetail.Post.app_id = obj.app_id;
            //shareDetail.postDetail.Post.provider_id = userLogin.user_id;
            console.log(shareDetail);
            //finalMessage.post_id = shareDetail.postDetail.Post.post_id;
            //finalMessage.app_id = shareDetail.postDetail.Post.app_id;
            //finalMessage.user_id = userLogin.user_id;
            //finalMessage.subscriber_id =shareDetail.postDetail.Subscriber.subscriber_id;
            //finalMessage.provider_id = shareDetail.postDetail.Post.provider_id;


        }*/

    }).directive("subList", function ($compile, Crud, $state, userLogin, shareDetail,hiLightService,chatData) {



        var directive = {};
        directive.restrict = 'AE';
        directive.scope = {};
        directive.template = "   <div class='row' style='padding: 0px'></div>";
        directive.replace = true;
        directive.link = function ($scope, element, attributes, ngModel) {

          console.log(hiLightService.hiLightArr)

          $scope.hilight = hiLightService.hiLightArr;

            console.log(attributes)
            element.html(
                "<div class='row sub-item' style='padding: 0' ng-class='{hilighted: hiLightUser()==true}'>" +
                "<div class='col-50 sub-name' style='padding: 0'>" +
                "<button class='col-100 button button-clear' style='text-align: left;width: 100%' ng-click='!isUserBlocked&&chatStuff()'>" + attributes.listName + "</button>" +
                "</div>" +
                "<div class='col-50 sub-buttons' style='padding: 0px'>" +

                "<button class=' button icon {{blockerIcon}}' ng-click='blockUser(isUserBlocked)'></button>" +
                "<span ng-hide='isUserBlocked'><button class=' button icon ion-android-done accept-color' ng-show='acceptStat' ng-click='acceptUser()'></button>" +
                "<button class=' button icon ion-android-close reject-color' ng-show='rejectStat' ng-click='rejectUser()'></button></span>" +
                "<span class='message-read' ng-show='checkMessages()'>{{messageCnt}}</span>"+
                "</div>" +
                "</div>"
            );


            $scope.acceptStat = false;
            $scope.rejectStat = false;



            $scope.Obj = $scope.$eval((attributes.listObj.replace(/\s+/g, '')));
            $scope.ends = (attributes.postends);

            $scope.checkMessages = function(){

              if($scope.Obj.hasOwnProperty('Chat')){
                $scope.messageCnt = $scope.Obj.Chat.length;
                //console.log($scope.messageCnt)
                return $scope.messageCnt != 0;
              }




            };






            if ($scope.Obj.UserBlock.block_id) {
                //$scope.blockerIcon = "ion-android-person-add";
                $scope.blockerIcon =  "ion-unlocked locked_green ";
                $scope.isUserBlocked = true;
                element.css("opacity", 0.5);
            } else {
                $scope.isUserBlocked = false;
                //$scope.blockerIcon = "ion-android-remove-circle";
                $scope.blockerIcon = "ion-locked locked_red";
                element.css("opacity", 1);
            }


          $scope.hiLightUser = function () {
            /*       console.log("this is arr ",$scope.hilight);
             console.log("this is obj ",$scope.Obj);*/
            //var ret = false;

            //console.log(hiLightService.hiLightArr[$scope.Obj.post_id].hasOwnProperty($scope.Obj.subscriber_id))

            if(hiLightService.hiLightArr.hasOwnProperty($scope.Obj.post_id)){
              return (hiLightService.hiLightArr[$scope.Obj.post_id].hasOwnProperty($scope.Obj.subscriber_id));
            }else{
              return false
            }

            /*angular.forEach($scope.hilight, function (v,k) {
              if(v.subscriber_id == $scope.Obj.subscriber_id&& v.post_id == $scope.Obj.post_id){
                //element.css("opacity", "0.0");
                ret = true;
              }

            })*/

            //return ret

            //ng-style="checkDate(myPosts.to_date,myPosts.to_time) == true? { opacity:0.3 } : { opacity:1 }"
          }


          //$scope.hiLightUser();


            //console.log($scope.Obj);

      /*      app_id: "1"
            post_id: "198"
            status: "accepted"
            subscriber_id: "56"
            user_id: "49"*/

            $scope.acceptUser = function () {
                console.log($scope.Obj);

                var acceptObj = {};
                acceptObj.post_id =         $scope.Obj.post_id;
                acceptObj.app_id =          $scope.Obj.app_id;
                acceptObj.subscriber_id =   $scope.Obj.subscriber_id;
                acceptObj.user_id =         $scope.Obj.user_id;

                console.log(acceptObj);
                Crud.create({
                    root: "posts/accept_post.json"
                }, acceptObj, function (response) {
                  if(new Date($scope.ends)<new Date(response.date)){
                    $state.go('green.myAds');
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({
                      disableBack: true,
                      disableAnimate: true,
                      historyRoot: true
                    });
                  }
                    $scope.acceptStat = false;
                    $scope.rejectStat = false;
                    if(response.status){
                        $scope.acceptStat = false;
                        $scope.rejectStat = true;
                    }else{
                        $scope.acceptStat = true;
                        $scope.rejectStat = false;
                    }
                })
            };

            $scope.rejectUser = function () {
                var rejectObj = {};
                rejectObj.post_id =             $scope.Obj.post_id;
                rejectObj.app_id =              $scope.Obj.app_id;
                rejectObj.subscriber_id =       $scope.Obj.subscriber_id;
                rejectObj.user_id =             $scope.Obj.user_id;

                console.log(rejectObj);
                $scope.hideReject = true;
                Crud.create({
                    root: "posts/reject_post_acceptance.json"
                }, rejectObj, function (response) {
                  if(new Date($scope.ends)<new Date(response.date)){
                    $state.go('green.myAds');
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({
                      disableBack: true,
                      disableAnimate: true,
                      historyRoot: true
                    });
                  }
                    $scope.acceptStat = false;
                    $scope.rejectStat = false;
                    if(response.status) {
                        $scope.acceptStat = true;
                        $scope.rejectStat = false;
                    }else{
                        $scope.acceptStat = false;
                        $scope.rejectStat = true;
                    }
                })
            };



            $scope.blockUser = function (stat) {
                if (!stat) {
                    console.log("user block " + $scope.Obj.User.user_id)
                    Crud.create({
                        root: "chats/block_user.json"
                    }, {"subscriber_id": $scope.Obj.subscriber_id, "block": "1", "app_id": "1"}, function check(data) {
                        console.log(data)
                        if (data.status) {
                          if(new Date($scope.ends)<new Date(data.date)){
                            $state.go('green.myAds');
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({
                              disableBack: true,
                              disableAnimate: true,
                              historyRoot: true
                            });
                          }
                            element.css("opacity", 0.5);
                            $scope.blockStat = true;
                          $scope.blockerIcon =  "ion-unlocked locked_green ";
                            $scope.isUserBlocked = true;
                        }
                    });

                } else {
                    Crud.create({
                        root: "chats/block_user.json"
                    }, {"subscriber_id": $scope.Obj.subscriber_id, "block": "0", "app_id": "1"}, function check(data) {
                        console.log(data)
                        if (data.status) {
                          if(new Date($scope.ends)<new Date(data.date)){
                            $state.go('green.myAds');
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({
                              disableBack: true,
                              disableAnimate: true,
                              historyRoot: true
                            });
                          }
                            element.css("opacity", 1);
                            $scope.blockStat = false;
                          $scope.blockerIcon = "ion-locked locked_red";
                            $scope.isUserBlocked = false;
                        }
                    });
                    //console.log("un block user "+ $scope.Obj.User.user_id)

                }
            };


            if ($scope.Obj.status == "requested") {

                $scope.blockStat = true;
                $scope.acceptStat = true;
                $scope.rejectStat = true;
            } else if ($scope.Obj.status == "accepted") {
                $scope.blockStat = true;
                $scope.acceptStat = false;
                $scope.rejectStat = true;
            } else if ($scope.Obj.status == "rejected") {
                $scope.blockStat = true;
                $scope.acceptStat = true;
                $scope.rejectStat = false;
            }else if ($scope.Obj.status == "chat_request") {
                $scope.blockStat = true;
                $scope.acceptStat = false;
                $scope.rejectStat = false;
            }



            $scope.chatStuff = function () {

              if(hiLightService.hiLightArr.hasOwnProperty($scope.Obj.post_id)){
                if(hiLightService.hiLightArr[$scope.Obj.post_id].hasOwnProperty($scope.Obj.subscriber_id)){
                  delete hiLightService.hiLightArr[$scope.Obj.post_id][$scope.Obj.subscriber_id];
                }
              }




              chatData.setChatObj({
                "subscriber_id":$scope.Obj.subscriber_id,
                "provider_id":localStorage.user_id,
                "post_id":$scope.Obj.post_id,
                "user_id":localStorage.user_id,
                "app_id":$scope.Obj.app_id,
                "user_flag":1,
                "provider_name":"Me",
                "subscriber_name":attributes.listName
              });
              //console.log(chatData.getChatObj());

              $state.go("green.chat");

              /*hareDetail.postDetail = {
                Subscriber: {
                  subscriber_id: $scope.Obj.subscriber_id,
                  subscriber_name: $scope.Obj.User.name,
                  subscriber_status: $scope.Obj.subscriber_status
                },
                Post: {
                  post_id: $scope.Obj.post_id,
                  app_id: $scope.Obj.app_id,
                  provider_id: userLogin.user_id,
                  post_actual_id: $scope.Obj.User.user_id
                }
              };

              console.log(shareDetail.postDetail);
              $state.go("green.chat");*/

          /*      console.log($scope.Obj)
                console.log($scope.Obj.subscriber_id)
                Crud.create({
                    root: "posts/subscriber_status.json"
                }, {"subscriber_id": $scope.Obj.subscriber_id}, function check(statData) {



                    console.log(statData);
                    if (statData.status) {
                      //console.log($scope.ends)
                      if(new Date($scope.ends)<new Date(statData.date)){
                        $state.go('green.myAds');
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $ionicHistory.nextViewOptions({
                          disableBack: true,
                          disableAnimate: true,
                          historyRoot: true
                        });
                      }

                        shareDetail.postDetail = {
                            Subscriber: {
                                subscriber_id: $scope.Obj.subscriber_id,
                                subscriber_name: $scope.Obj.User.name,
                                subscriber_status: $scope.Obj.subscriber_status
                            },
                            Post: {
                                post_id: $scope.Obj.post_id,
                                app_id: $scope.Obj.app_id,
                                provider_id: userLogin.user_id,
                                post_actual_id: $scope.Obj.User.user_id
                            }
                        };
                        $state.go("green.chat");
                    }
                });*/
            };


            $compile(element)($scope);
        };
        return directive;
    });
