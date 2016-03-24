

angular.module('ionicApp.proAppCtrl', [])
    .controller('proAppCtrl', function ($scope,userLogin, $rootScope,$ionicPopup, $templateCache,$ionicPlatform, $ionicHistory, $ionicModal, $state) {
        $scope.name = $state.current.name;


        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicPlatform.registerBackButtonAction(function () {
            if (!userLogin.isLoggedIn) {
                $state.go('green.login');
                $ionicHistory.clearHistory();
                navigator.app.clearHistory();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
            }
            else {
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


    })