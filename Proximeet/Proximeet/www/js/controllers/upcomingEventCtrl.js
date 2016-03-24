angular.module('ionicApp.upcomingEventCtrl', [])
    .controller('upcomingEventCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, Crud,$cordovaToast) {


        $scope.showLoginError = true;
        $scope.$on('$ionicView.beforeEnter', function () {

            if (!userLogin.isLoggedIn) {
                $scope.showLoginError = true;
            }
            else {
                $scope.showLoginError = false;
            }


        });

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
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicPlatform.registerBackButtonAction(function () {


            if (!userLogin.isLoggedIn) {
                if ($state.current.name == "green.upcomingEvent") {
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
                if ($state.current.name == "green.upcomingEvent") {
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



        $scope.gotoMenuThree = function () {
            $state.go('green.threeMenu');
        }


        $scope.upcomingEvent = [];

        function upcomingEventData(count) {
            if (userLogin.isLoggedIn) {
                var userObj = {"user_id": localStorage.user_id};
                console.log(userObj);
                Crud.create({
                    root: "Favourites/upcoming_events.json"
                }, userObj, function (data) {

                    if(data.status){
                      console.log(data);
                      $scope.upcomingEvent = data.result;
                      if(data.result.length<1){
                        $cordovaToast
                          .show('No more upcoming events.', 'short', 'center')
                          .then(function(success) {
                            // success
                          }, function (error) {
                            // error
                          });
                      }
                      //console.log(data)
                    }else{
                      /*$cordovaToast
                        .show('No more upcoming events.', 'short', 'center')
                        .then(function(success) {
                          // success
                        }, function (error) {
                          // error
                        });*/
                    }




                })
            }
        }


        $scope.$on('$ionicView.beforeEnter', function () {
            upcomingEventData(1)
        })



        $scope.showFullAd = function (post) {
          $scope.isInfoShown = false;
            $scope.eachPostedObj = post;
          if(($scope.eachPostedObj.Post.no_of_slots)=="null" || ($scope.eachPostedObj.Post.no_of_slots)=="0"||($scope.eachPostedObj.Post.no_of_slots)=="undefined" ){
            $scope.eachPostedObj.Post.no_of_slots= "open for public"
          }else{
            $scope.eachPostedObj.Post.no_of_slots= ($scope.eachPostedObj.Post.no_of_slots);
          }
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
            });
        };



    });
