angular.module('ionicApp.initCtrl', ['ngCordova', 'ngCordovaOauth', 'ionicApp.factories'])
        .controller('initCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform,
                $ionicHistory, $ionicModal, $state, $ionicSideMenuDelegate, $http, Crud) {


            localStorage.setItem("AdminID", "1");

            var restoreLoading = $rootScope.$$listeners["loading:show"];

            $rootScope.$$listeners["loading:show"] = [];
            $scope.$on('$ionicView.beforeLeave', function () {
                $rootScope.$$listeners["loading:show"] = restoreLoading;
                sessionStorage.clear();
            });

            sessionStorage.category = "";

            $ionicSideMenuDelegate.canDragContent(false);
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();


            $scope.ignoreAuthentication = function () {
                setTimeout(function () {

                    if (!localStorage.hasOwnProperty("showSkipIntroBtn")) {
                        localStorage.showSkipIntroBtn = true;
                    }

                    userLogin.setLoginStat(false);

                    var reg = localStorage.reg;
                    var uuid = localStorage.uuid;
                    var aAdminID = localStorage.AdminID;
                    var isIntroOver = localStorage.isIntroOver;
                    var showSkipIntroBtn = localStorage.showSkipIntroBtn;
                    localStorage.clear();
                    localStorage.reg = reg;
                    localStorage.uuid = uuid;
                    localStorage.AdminID = aAdminID;
                    localStorage.isIntroOver = isIntroOver;
                    localStorage.showSkipIntroBtn = showSkipIntroBtn;

                    $ionicSideMenuDelegate.canDragContent(true);
                    if (localStorage.hasOwnProperty("isIntroOver")) {
                        if (eval(localStorage.isIntroOver) == true) {
                            $state.go('green.search');
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            return;
                        }
                    }
                    $state.go('green.introSlider');
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    localStorage.notificationDelay = 0;
                }, 5000);
            };

            $scope.setLogin = function (response) {
                sessionStorage.clear();
                localStorage.name = response.result.User.name;
                localStorage.user_name = response.result.User.user_name;
                localStorage.phone_no = response.result.User.phone_no;
                localStorage.email = response.result.User.email;
                localStorage.email_verify = response.result.User.email_verify;
                localStorage.image_path = response.result.User.image_path;
                localStorage.user_id = response.result.User.user_id;
                localStorage.user_loc = response.result.User.address;
                localStorage.privacy = response.result.User.privacy_setting;
                localStorage.loginMethod = "google";
                $scope.testLog = true;
                userLogin.setLoginStat(true);
                userLogin.setUserId(response.result.User.user_id);

                if (localStorage.hasOwnProperty("isIntroOver")) {
                    if (eval(localStorage.isIntroOver) == true) {
                        $state.go('green.search');
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        return;
                    }
                }
                $state.go('green.introSlider');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
            };


            if (localStorage.hasOwnProperty("loginMethod") == true) {

                var regObj = {};
                //alert(JSON.stringify(data));

                if (localStorage.uuid && localStorage.reg) {
                    regObj.device_id = localStorage.uuid;
                    regObj.device_token = localStorage.reg;
                } else {
                    regObj.device_id = sessionStorage.uuid;
                    regObj.device_token = sessionStorage.reg;
                }
                ;
                regObj['email'] = localStorage.email;

                switch (localStorage["loginMethod"]) {
                    case "google":
                        if (localStorage.hasOwnProperty("email")) {
                            Crud.create({root: "users/rest_email_check.json"}, regObj, function (response) {
                                if (response.status) {
                                    if (response.result.User.phone_verify == "1") {
                                        $scope.setLogin(response);
                                    } else {
                                        $scope.ignoreAuthentication();
                                    }

                                } else {
                                    $scope.ignoreAuthentication();
                                }
                            })
                        } else {
                            $scope.ignoreAuthentication();
                        }

                        break;
                    case "facebook":
                        if (localStorage.hasOwnProperty("email")) {
                            Crud.create({root: "users/rest_email_check.json"}, regObj, function (response) {
                                if (response.status) {
                                    if (response.result.User.phone_verify == "1") {
                                        $scope.setLogin(response);
                                    } else {
                                        $scope.ignoreAuthentication();
                                    }

                                } else {
                                    $scope.ignoreAuthentication();
                                }
                            })
                        } else {
                            $scope.ignoreAuthentication();
                        }
                        break;
                    case "normal":
                        if (localStorage['email'] && localStorage['name'] && localStorage['phone_no'] && localStorage['user_id'] && localStorage['user_name']) {
                            //alert("user logged in...")
                            userLogin.setLoginStat(true);
                            userLogin.setUserId(localStorage['user_id']);
                            setTimeout(function () {

                                $ionicSideMenuDelegate.canDragContent(true);
                                if (localStorage.hasOwnProperty("isIntroOver")) {
                                    if (eval(localStorage.isIntroOver) == true) {
                                        $state.go('green.search');
                                        $ionicHistory.clearCache();
                                        $ionicHistory.clearHistory();
                                        $ionicHistory.nextViewOptions({
                                            disableBack: true
                                        });
                                        return;
                                    }
                                }
                                $state.go('green.introSlider');
                                $ionicHistory.clearCache();
                                $ionicHistory.clearHistory();
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                localStorage.notificationDelay = 0;
                            }, 5000);
                        } else {
                            $scope.ignoreAuthentication();
                        }
                        break;
                    default :
                        $scope.ignoreAuthentication();
                }
            } else {
                $scope.ignoreAuthentication();
            }


        });
