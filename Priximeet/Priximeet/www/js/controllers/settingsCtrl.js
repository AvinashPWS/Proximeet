angular.module('ionicApp.settingsCtrl', [])
    .controller('settingsCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state) {
        $scope.name = $state.current.name;

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

    $scope.checkNormal = function(){
      return (localStorage.loginMethod == "normal")
    };
    $scope.must_login();

        //$ionicHistory.clearCache();
        //$ionicHistory.clearHistory();
        //$ionicPlatform.registerBackButtonAction(function () {
        //
        //    if ($state.current.name == "green.settings") {
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
        //}, 100);

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
                if ($state.current.name == "green.settings") {
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
                if ($state.current.name == "green.settings") {
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

        $scope.gotoProfileSettings = function () {
            console.log("go ot profile");
            $state.go('green.profile');
            $ionicHistory.nextViewOptions({
                disableBack: false
            });
        };

        $scope.gotoNotificationSettings = function () {
            $state.go('green.notification');
            $ionicHistory.nextViewOptions({
                disableBack: false
            });
        };

        $scope.gotoPrivacySettings = function () {
            $state.go('green.privacy');
            $ionicHistory.nextViewOptions({
                disableBack: false
            });
        };


        $scope.gotoPwdSettings = function () {
            $state.go('green.pwd');
            $ionicHistory.nextViewOptions({
                disableBack: false
            });
        };

    })
