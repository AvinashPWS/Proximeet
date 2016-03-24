angular.module('ionicApp.myResponsesCtrl', [])
    .controller('myResponsesCtrl', function ($ionicViewService,shareDetail, Crud, $scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state,$ionicActionSheet,$q,$cordovaToast) {
        $scope.count = 2;
    $scope.serverTime = undefined;

        $scope.gotoMenuThree = function () {
            $state.go('green.threeMenu');
        };

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


        //$ionicHistory.clearCache();
        //$ionicHistory.clearHistory();

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

        $scope.data={};

        $scope.showLoginError = true;

        $scope.$on('$ionicView.beforeLeave', function () {
            $scope.count = 2;
        });


        $scope.$on('$ionicView.beforeEnter', function () {

            $scope.count = 2;
            var history = $ionicViewService.getBackView();
            console.log(history);


            console.log("response before");
            if (!userLogin.isLoggedIn) {
                $scope.showLoginError = true;
            }
            else {
                $scope.showLoginError = false;
            }



            while (init_arr.length > 0) {
                init_arr.pop();
            }


        });


        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicPlatform.registerBackButtonAction(function () {


            if (!userLogin.isLoggedIn) {
                if($state.current.name == "green.myResponses"){
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
                if ($state.current.name == "green.myResponses") {
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


        var totalPageCount = 0;
        var init_arr = [];

        $scope.$on('$ionicView.enter', function () {
            makeReq("1");
        });

    $scope.getRemainingCnt = function(data){
      var finalData;
      if(data.Subscriber[0].Chat){
        if(data.Subscriber[0].Chat.length){
          finalData = data.Subscriber[0].Chat.length;
        }
      }

      return finalData;

    };






        function makeReq(page) {
            $scope.list = [];
            console.log("make request");
            if (userLogin.user_id != "") {

                var favoObj = {};
                favoObj.user_id = userLogin.user_id;
                Crud.create({
                    root: "users/my_responses/page:" + page + ".json"
                }, favoObj, function check(response) {
                    console.log(response);

                    if (response.status) {
                      $scope.serverTime = response.date;
                        //count++;
                        totalPageCount = response.total_pages;
                        //$scope.emptyArr = false;
                        //$scope.todos.unshift({name: 'Incoming todo ' + Date.now()})
//                        console.log(response);
//                        console.log(response.result);



                        for (y = 0; y < response.result.length; y++) {
                            init_arr.push(response.result[y]);
                        }

                      if(response.result.length==0){
                        $cordovaToast
                          .show('No you have not yet responded to any Event.', 'short', 'center')
                          .then(function(success) {
                            // success
                          }, function (error) {
                            // error
                          });
                      }

                        $scope.list = init_arr;
                        console.log(init_arr);
                        //$scope.list = response.result;
//                        console.log($scope.list);
                    }

                });
            }
        }


        $scope.loadMore = function (event) {

            console.log($scope.count,totalPageCount)
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if ($scope.count <= totalPageCount) {
                console.log("event->",event);
                console.log("load more....")
                makeReq($scope.count);
                $scope.count++;
            }
        };

        $scope.$on('$stateChangeSuccess', function () {
            $scope.loadMore();
        });


        $scope.checkUserLogin = function () {
            if (userLogin.user_id == "") {

                $ionicPopup.alert({
                    title: "Error",
                    content: "Please login to continue"
                }).then(function (res) {
                    if (res) {

                        navigator.app.clearHistory();
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $state.go('green.login');

                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            disableAnimate: true,
                            historyRoot: true
                        });
                    } else {
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
                });
                return false;
            }
            else {
                return true;
            }
        };

        $scope.checkDate = function (endDate) {


          return new Date($scope.serverTime) > new Date(endDate)



          //console.log("to time -- >",eval(time))
            /*var  timeFinal;
            if(time != "undefined"||time != ""){
                timeFinal = time;
            }else{
                timeFinal ="23:59:00"
            }
          console.log("to time -- >",timeFinal)
          console.log("is active ad --- > ", (new Date(date+" "+timeFinal) < new Date($scope.serverTime)));
          console.log("server time --- > ", ($scope.serverTime));
          console.log("ad end time  --- > ", (new Date(date+" "+timeFinal)));
            return new Date(date+" "+timeFinal) < new Date($scope.serverTime);*/
        };

        function checkDates(startdate,enddate){




            var tday = new Date($scope.serverTime);
            var sday = new Date(startdate);
            var edate = new Date(enddate);
            var stat;
            if(tday>sday&&tday<edate){
                stat = "middle"
            }else if(tday<sday){
                stat="not yet"
            }else if(tday>edate){
                stat = "over"
            }

            return stat;


        }


        $scope.checkRating = function (postId) {

            var deferred = $q.defer();

            var message,rating;


            Crud.create({root: "reviews/is_rated.json"},{"user_id":localStorage.user_id,"post_id":postId}, function (response) {
                console.log(response);
                if(response.status){
                  //rated
                    /*var retObj = {}
                    retObj.rating = parseInt(response.review.rating);
                    retObj.message = (response.review.message)?response.review.message:'';
                    console.log(rating,message)


                    deferred.resolve(retObj)*/
                  //console.log("res data",response)
                  deferred.resolve(false)


                }else{
                  //not rated
                  /*  var retObj = {}
                    retObj.rating = 1;
                    retObj.message = '';
                    console.log(rating,message)
                    deferred.resolve(retObj)*/
                  //console.log("res data",response)
                  deferred.resolve(true)

                }
            });

            return deferred.promise;

        };

        $scope.showDetails = function (postid,startdate,enddate) {
          console.log(postid,startdate,enddate);
            var stat = checkDates(startdate,enddate);

            console.log(stat);
            if(stat=="not yet"){

                $ionicActionSheet.show({
                    buttons: [
                        {text: '<i class="icon ion-ios-heart theme-icon"></i>Add to Favourite'},
                        //{text: '<i class="icon ion-compose theme-icon"></i>Rate this ad'},
                        {text: '<i class="icon ion-android-warning theme-icon"></i>Report Abuse'}
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
                                favoObj.status = 1;
                                Crud.create({
                                    root: "favourites/favourite1.json"
                                }, favoObj, function (response) {
//                                    console.log(response);
                                    if (response.message == "success") {
                                        $ionicPopup.alert({
                                            title: "Success",
                                            content: "Successfully added to your favorite list"
                                        }).then(function (res) {

                                        })
                                    }
                                    else {
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

                                      if(!reviewObj.message){
                                        $ionicPopup.alert({
                                          title: "Alert",
                                          content: "Your message is required"
                                        }).then(function (res) {

                                        });
                                        return;
                                      }

                                        console.log(reviewObj);
                                        Crud.create({root: "reviews/report_abuse.json"}, reviewObj, function (response) {
                                            //console.log(response)
                                            if (response.message = "success") {
                                                $ionicPopup.alert({
                                                    title: "Success",
                                                    content: "Request sent, Please wait for acceptance."
                                                }).then(function (res) {

                                                })

                                                $scope.data = {};
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
            }
            else if(stat=="middle"){
                $ionicActionSheet.show({
                    buttons: [
                        {text: '<i class="icon ion-ios-heart theme-icon"></i>Add to Favourite'},
                        //{text: '<i class="icon ion-compose theme-icon"></i>write a review'},
                        {text: '<i class="icon ion-android-warning theme-icon"></i>Report Abuse'}
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
                                                content: "Successfully added to your favorite list"
                                            }).then(function (res) {

                                            })
                                        }
                                        else {
                                            $ionicPopup.alert({
                                                title: "Error",
                                                content: response.message
                                            }).then(function (res) {

                                            })
                                        }
                                    });

                                }
                                break;
                            //case 1:
                            //respond

                            //$state.go("green.chat")
                            //break;

                            case 1:
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
                                          if(!reviewObj.message){
                                            $ionicPopup.alert({
                                              title: "Alert",
                                              content: "Your message is required"
                                            }).then(function (res) {

                                            });
                                            return;
                                          }

                                            console.log(reviewObj);
                                            Crud.create({root: "reviews/report_abuse.json"}, reviewObj, function (response) {
                                                //console.log(response)
                                                if (response.message = "success") {
                                                    $ionicPopup.alert({
                                                        title: "Success",
                                                        content: "Request sent, Please wait for acceptance."
                                                    }).then(function (res) {

                                                    })

                                                    $scope.data = {};
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
            }
            else if(stat=="over"){
                $ionicActionSheet.show({
                    buttons: [
                        {text: '<i class="icon ion-compose theme-icon"></i>write a review'},
                        {text: '<i class="icon ion-android-warning theme-icon"></i>Report Abuse'}
                    ],
                    // destructiveText: 'Delete',
                    // cancelText: 'Cancel',
                    buttonClicked: function (index) {
                        //alert(index);
                        switch (index) {

                            case 0:
                                if ($scope.checkUserLogin()) {


                                    $scope.checkRating(postid).then(function (statyus) {
                                      if(statyus){
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

                                                });

                                                $scope.data = {};
                                              }
                                            });

                                          } else {

                                          }
                                        });
                                      }else{
                                        $ionicPopup.alert({
                                          title: "Alert",
                                          content: "You have already rated this ad"
                                        }).then(function (res) {

                                        });
                                      }

                                       /* $scope.data.rating = reatingObj.rating;
                                        $scope.data.message =reatingObj.message;
                                        $scope.data.disableTextArea = false;
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

                                                        });

                                                        $scope.data = {};
                                                    }
                                                });

                                            } else {

                                            }
                                        });*/
                                    });



                                }

                                break;
                            case 1:
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
                                          if(!reviewObj.message){
                                            $ionicPopup.alert({
                                              title: "Alert",
                                              content: "Your message is required"
                                            }).then(function (res) {

                                            });
                                            return;
                                          }
                                            console.log(reviewObj);
                                            Crud.create({root: "reviews/report_abuse.json"}, reviewObj, function (response) {
                                                //console.log(response)
                                                if (response.message = "success") {
                                                    $ionicPopup.alert({
                                                        title: "Success",
                                                        content: "Request sent, Please wait for acceptance."
                                                    }).then(function (res) {

                                                    })

                                                    $scope.data = {};
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
            }



        };

        $scope.gotoDetailPage = function (obj) {
            //searcPosts

            shareDetail.postDetail = obj;
            console.log(obj);
            $ionicHistory.clearCache();
            console.log("Goto detil page");
            $state.go('green.detail',{post_id:obj.Post.post_id});
            $ionicHistory.nextViewOptions({
                disableBack: false,
                disableAnimate: true
            });
        }
    });
