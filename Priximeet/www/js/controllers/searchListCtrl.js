angular.module('ionicApp.searchListCtrl', [])
        .controller('searchListCtrl', function (shareDetail, $scope, userLogin, $ionicNavBarDelegate, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state
                , postList, $ionicActionSheet, Crud, $cordovaToast) {


            $ionicPlatform.onHardwareBackButton(function (e) {
                $ionicHistory.goBack();


            }, 100);


            $scope.posedLists = postList.listOfPostsArr;

            if ($scope.posedLists.length < 1) {

                $cordovaToast
                        .show('No Ad/Post to display.', 'short', 'center')
                        .then(function (success) {
                            // success
                        }, function (error) {
                            // error
                        });

            }
            
            localStorage.searshListVisit = true;

            console.log($scope.posedLists);

            $ionicHistory.nextViewOptions({
                disableBack: false
            });
            $scope.data = {};


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
                } else {
                    return true;
                }
            };

//        $scope.showDetails = function (postid) {
//            $ionicActionSheet.show({
//                buttons: [
//                    {text: '<i class="icon ion-ios-heart theme-icon"></i>Add to Favourite'},
//                    {text: '<i class="icon ion-compose theme-icon"></i>Write a review'},
//                    {text: '<i class="icon ion-android-warning theme-icon"></i>Report Abuse'}
//                ],
//                // destructiveText: 'Delete',
//                // cancelText: 'Cancel',
//                buttonClicked: function (index) {
//                    //alert(index);
//                    switch (index) {
//                        case 0:
//                            if ($scope.checkUserLogin()) {
//
//
//                                var favoObj = {};
//                                favoObj.user_id = userLogin.user_id;
//                                favoObj.post_id = postid;
//                                favoObj.app_id = 1;
//                                Crud.create({
//                                    root: "favourites/favourite.json"
//                                }, favoObj, function (response) {
////                                    console.log(response);
//                                    if (response.message == "success") {
//                                        $ionicPopup.alert({
//                                            title: "Success",
//                                            content: "Successfully added to your favorite list"
//                                        }).then(function (res) {
//
//                                        })
//                                    }
//                                    else {
//                                        $ionicPopup.alert({
//                                            title: "Error",
//                                            content: response.message
//                                        }).then(function (res) {
//
//                                        })
//                                    }
//                                });
//
//                            }
//                            break;
//                        //case 1:
//                            //respond
//
//                            //$state.go("green.chat")
//                            //break;
//                        case 1:
//                            if ($scope.checkUserLogin()) {
//                                $scope.data.rating = 1;
//
//                                $ionicPopup.confirm({
//                                    title: 'Review',
//                                    scope: $scope,
//                                    templateUrl: "review_post.html"
//                                }).then(function (res) {
//                                    if (res) {
//                                        var reviewObj = {};
//                                        reviewObj.user_id = userLogin.user_id;
//                                        reviewObj.post_id = postid;
//                                        reviewObj.rating = $scope.data.rating;
//                                        reviewObj.message = $scope.data.message;
//                                        reviewObj.app_id = 1;
//                                        console.log(reviewObj);
//                                        Crud.create({root: "reviews/review.json"}, reviewObj, function (response) {
//                                            if (response.status) {
//                                                $ionicPopup.alert({
//                                                    title: "Success",
//                                                    content: "Successfully added the review"
//                                                }).then(function (res) {
//
//                                                });
//
//                                                $scope.data = {};
//                                            }
//                                        });
//
//                                    } else {
//
//                                    }
//                                });
//
//                            }
//
//                            break;
//                        case 2:
//                            if ($scope.checkUserLogin()) {
//                                $ionicPopup.confirm({
//                                    title: 'Report abuse',
//                                    scope: $scope,
//                                    templateUrl: "abused_post.html"
//                                }).then(function (res) {
//                                    if (res) {
//                                        var reviewObj = {};
//                                        reviewObj.user_id = userLogin.user_id;
//                                        reviewObj.post_id = postid;
//                                        reviewObj.message = $scope.data.message_abuse;
//
//                                        console.log(reviewObj);
//                                        Crud.create({root: "reviews/report_abuse.json"}, reviewObj, function (response) {
//                                            //console.log(response)
//                                            if (response.message = "success") {
//                                                $ionicPopup.alert({
//                                                    title: "Success",
//                                                    content: "Report has been received"
//                                                }).then(function (res) {
//
//                                                })
//
//                                                $scope.data = {};
//                                            }
//                                        });
//
//                                    } else {
//
//                                    }
//                                });
//                            }
//                            break;
//                    }
//
//                    return true;
//                }
//            });
//
//        };


            $scope.gotoDetailPage = function (obj) {
                //searcPosts
                shareDetail.postDetail = obj;
                console.log("Goto detil page");
                $state.go('green.detail', {post_id: obj.Post.post_id});
                $ionicHistory.nextViewOptions({
                    disableBack: false,
                    disableAnimate: true
                });
            }

        });
