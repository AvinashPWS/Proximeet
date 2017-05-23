angular.module('ionicApp.myFavoritesCtrl', [])
  .controller('myFavoritesCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, Crud, $state,$cordovaToast) {

    $scope.gotoMenuThree = function () {
      $state.go('green.threeMenu');
    }


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

    $scope.showLoginError = true;
    $scope.$on('$ionicView.beforeEnter', function () {

      if (!userLogin.isLoggedIn) {
        $scope.showLoginError = true;
      }
      else {
        $scope.showLoginError = false;
      }


    });

    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicPlatform.registerBackButtonAction(function () {


      if (!userLogin.isLoggedIn) {
        if ($state.current.name == "green.myFavorites") {
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
        if ($state.current.name == "green.myFavorites") {
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


    var count = 2;
    var totalPageCount = 0;
    var init_arr = [];

    function makeReq(page) {
//                 console.log($scope.list);
      if (userLogin.user_id != "") {

        var favoObj = {};
        favoObj.user_id = userLogin.user_id;
        Crud.create({
          root: "Favourites/my_fevorites/page:" + page + ".json"
        }, favoObj, function check(response) {
          console.log(response.total_pages);
          if (response.status) {
            console.log(response)
            //console.log("server time",response.date);
            $scope.serverTime = response.date;
            //count++;
            totalPageCount = response.total_pages;
            $scope.emptyArr = false;
            //$scope.todos.unshift({name: 'Incoming todo ' + Date.now()})
//                        console.log(response);
//                        console.log(response.result);
            for (y = 0; y < response.result.length; y++) {
              init_arr.push(response.result[y]);
            }

            $scope.list = init_arr;

            if (response.result.length == 0) {
              $cordovaToast
                .show('No Favorite Events in your list.', 'short', 'center')
                .then(function(success) {
                  // success
                }, function (error) {
                  // error
                });
            }
            //$scope.list = response.result;
//                        console.log($scope.list);
          }


        });
      }

    }

    makeReq(1);


    $scope.removePost = function(index,id){

      $ionicPopup.confirm({
        title: "Alert",
        content: "Are you sure? You want to remove from favourites?"
      }).then(function (res) {
        if(res){
          var favoObj = {};
          favoObj.user_id = userLogin.user_id;
          favoObj.post_id = id;
          favoObj.app_id = 1;
          favoObj.status = 0;
          Crud.create({
            root: "favourites/favourite1.json"
          }, favoObj, function (response) {
            console.log("del res",response)
//                                    console.log(response);
            if (response.status) {

              $scope.list.splice(index,1);

              $ionicPopup.alert({
                title: "Success",
                content: "successfully removed from favourites"
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
      })


    }

    $scope.loadMore = function () {
      $scope.$broadcast('scroll.infiniteScrollComplete');
      if (count <= totalPageCount) {
        makeReq(count);
        count++;
      }
    };

    $scope.$on('$stateChangeSuccess', function () {
      $scope.loadMore();
    });

    $scope.checkDate = function (endDate) {

      console.log("check date",new Date(endDate) < new Date($scope.serverTime))

      if (new Date(endDate) < new Date($scope.serverTime)) {
        return true;
      } else {
        return false;
      }
    }



    $scope.showFullAd = function (post) {



        //searcPosts


        console.log("Goto detil page");
        $state.go('green.detail',{post_id:post.Post.post_id});
        $ionicHistory.nextViewOptions({
          disableBack: false,
          disableAnimate: true
        });


     /* $scope.isInfoShown = false;

      $scope.eachPostedObj = post;

      console.log("check slots--->",post)
      if(($scope.eachPostedObj.Post.no_of_slots)=="null" || ($scope.eachPostedObj.Post.no_of_slots)=="0"||($scope.eachPostedObj.Post.no_of_slots)=="undefined" ){
        $scope.eachPostedObj.Post.no_of_slots= "open for public"
      }else{
        $scope.eachPostedObj.Post.no_of_slots= ($scope.eachPostedObj.Post.no_of_slots);
      }
      console.log("each list", post)
      $ionicModal.fromTemplateUrl('viewPostedAd.html', {
        scope: $scope,
        animation: 'scale-in'
      }).then(function (modal) {

        if(post.User.privacy_setting == true){

          angular.forEach(post.Subscriber, function (v,k) {
            if(v.User.user_id==localStorage.user_id&& v.status == "accepted"){
              $scope.isInfoShown= true;
            }else{
              $scope.isInfoShown= false;
            }
          })
        }else{
          $scope.isInfoShown= false;
        }

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
      });*/
    };


  });
