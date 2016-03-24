angular.module('ionicApp', [
    'ionic', 'ionicApp.mainController',
    'ionicApp.config',
    'ionicApp.factories',
    'ionicApp.services',
    'ngAnimate'
]);
//    .controller("mainCtrl", function ($scope, $state, $ionicHistory,userLogin) {
//
//    $scope.initLogin = function () {
//
//        if (localStorage.email  !=" "&& localStorage.password!=" " && localStorage.responseId!=" ") {
//
//
//            //alert("demo");
//            //console.log(localStorage.email + " " + localStorage.password);
//            console.log(userLogin.isLoggedIn);
//            $state.go('green.search');
//            $ionicHistory.clearCache();
//            $ionicHistory.clearHistory();
//            $ionicHistory.nextViewOptions({
//                disableBack: true,
//                historyRoot: true
//            });
//            localStorage.loginStat = true;
//            userLogin.setLoginStat(true);
//            userLogin.setUserId(localStorage.responseId);
//
//
//        }else{
//            console.log(userLogin.isLoggedIn);
//            $state.go('green.login');
//            $ionicHistory.clearCache();
//            $ionicHistory.clearHistory();
//            $ionicHistory.nextViewOptions({
//                disableBack: true,
//                historyRoot: true
//            });
//            localStorage.loginStat = false;
//            userLogin.setLoginStat(false);
//        }
//    }
//
//
//
//});
//
//
