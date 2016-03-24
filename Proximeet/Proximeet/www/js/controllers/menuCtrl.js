angular.module('ionicApp.menuCtrl', [])
        .controller("menuCtrl", function ($scope, userLogin,
                $rootScope, $ionicPopup,
                $templateCache, $ionicHistory, $ionicModal, $state, $ionicSideMenuDelegate, $timeout) {
            
            $scope.showUserChatMenu = (userLogin.user_id === localStorage.getItem("AdminID")) ? true : false;
            
            $scope.$watch(function () {
                return $ionicSideMenuDelegate.getOpenRatio();
            }, function (value) {
                //do something
                if (value > 0.5) {
                    document.activeElement.blur();
                    $scope.usr_nm = localStorage.user_name;
                    $scope.usr_location = (localStorage.user_loc != undefined || localStorage.user_loc != "undefined") ? localStorage.user_loc : "";
                }
                //console.log(value);
            });

            $scope.name = $state.current.name;
            $ionicHistory.currentView($ionicHistory.backView());

            if (localStorage.hasOwnProperty("image_path") && localStorage['image_path'] != "undefined") {
                $scope.img_path = localStorage.image_path;
                $scope.usr_nm = localStorage.user_name;
                $scope.usr_location = (localStorage.user_loc != undefined || localStorage.user_loc != "undefined") ? localStorage.user_loc : "";
            } else {
                $scope.img_path = undefined;
                $scope.usr_nm = undefined;
                $scope.usr_location = undefined;
            }


            $scope.unpdateUSerInfo = function () {
                document.activeElement.blur();

                $scope.usr_nm = localStorage.user_name;
                $scope.usr_location = localStorage.user_loc;


                if (localStorage.hasOwnProperty("image_path") && localStorage['image_path'] != undefined) {
                    $scope.img_path = localStorage.image_path;

                } else {
                    $scope.img_path = undefined;
                }
            }

            $ionicHistory.clearCache();

            userLogin.observeLoginStat().then(null, null, function (stat) {
                $scope.switchlogger = stat;
                $scope.showUserChatMenu = (userLogin.user_id === localStorage.getItem("AdminID")) ? true : false;
            });



            $scope.logout = function () {
                userLogin.setLoginStat(false);
                var reg = localStorage.reg;
                var uuid = localStorage.uuid;
                var aAdminID = localStorage.AdminID;
                localStorage.clear();
                localStorage.reg = reg;
                localStorage.uuid = uuid;
                localStorage.AdminID = aAdminID;

                sessionStorage.clear();
                /*var i = localStorage.length;
                 while(i--) {
                 var key = localStorage.key(i);
                 if(/uuid/.test(key)) {
                 break;
                 }
                 else if(/reg/.test(key)) {
                 break;
                 }
                 localStorage.removeItem(key);
                 }*/
                userLogin.user_id = "";
                $state.go('green.login');
                navigator.app.clearHistory();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $scope.img_path = undefined;
                $scope.usr_nm = undefined;
            }

            $scope.exitApp = function () {
                navigator.app.exitApp();
            };


            /*$scope.must_login = function () {
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
             
             
             }*/


        }).directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {

            scope.$watch(function () {
                return attrs['ngSrc'];
            }, function (value) {
                if (!value) {
                    element.attr('src', attrs.errSrc);
                }
            });

            element.bind('error', function () {
                element.attr('src', attrs.errSrc);
            });
        }
    };
});
