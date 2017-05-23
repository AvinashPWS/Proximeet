angular.module('ionicApp.threeMenuCtrl', [])
    .controller('threeMenuCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state,Crud,$ionicSlideBoxDelegate) {


        $ionicPlatform.onHardwareBackButton(function (e) {
            $ionicHistory.goBack();
        }, 100);

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

        $scope.showLoginError=true;

        $scope.showUpcomingError = false;
        $scope.showMyadsError = false;
        $scope.showResponseError = false;

        $scope.$on('$ionicView.beforeEnter', function () {

            if(userLogin.isLoggedIn){
                $scope.showLoginError = false;
                Crud.create({
                    root: "Favourites/quick_view.json"
                }, {user_id:localStorage.user_id}, function check(response) {
                  console.log("3-->res",response);
                  console.log("type up",typeof (response.upcoming_events));
                  console.log("type myads", typeof (response.myposts));
                  console.log("type myres",typeof (response.myresponses));



                    if (response.status) {
                        console.log(response);
                        $scope.myAdsArr=response.myposts;
                        $scope.upcomingArr=response.upcoming_events;
                        $scope.myResArr=response.myresponses;
                        $ionicSlideBoxDelegate.update();

                        if(typeof (response.upcoming_events) == "string"){
                            $scope.showUpcomingError = true;
                            $scope.noResUpcoming =  "No Results found."
                        }
                        if( typeof (response.myposts) == "string"){
                            $scope.showMyadsError = true;
                            $scope.noResMyAds =  "No Results found."
                        }

                        if(typeof (response.myresponses) == "string"){
                            $scope.showResponseError = true;
                            $scope.noResMyResponse =  "No Results found."
                        }
                        console.log(response.upcoming_events)
                    }

                })
            }
        })


    });
