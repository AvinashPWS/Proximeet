angular.module('ionicApp.reviewCtrl', [])
    .controller('reviewCtrl', function ($scope,userLogin, $rootScope,$ionicPopup, $templateCache,$ionicPlatform, $ionicHistory, $ionicModal, $state) {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();

        $ionicPlatform.registerBackButtonAction(function () {

            if(userLogin.isLoggedIn){
                navigator.app.clearHistory();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
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





        }, 100);




    });