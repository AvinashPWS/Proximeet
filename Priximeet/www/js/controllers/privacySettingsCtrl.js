angular.module('ionicApp.privacySettingsCtrl', [])
  .controller('privacySettingsCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, Crud) {
    $ionicPlatform.onHardwareBackButton(function () {
      $ionicPlatform.onHardwareBackButton(function () {

        $ionicHistory.goBack();

      }, 100);

    }, 100);

    $scope.data = {};

    $scope.data.privacyValue =eval(localStorage.privacy);
    console.log( $scope.data.privacyValue)

    $scope.checkBoxChange = function(){
      console.log($scope.data.privacyValue);
      Crud.create({
        root: "users/privacy_setting.json"
      }, {"user_id": userLogin.user_id, "privacy_setting": $scope.data.privacyValue}, function (response) {
        if (response.status) {
          console.log(response);
          localStorage.privacy = $scope.data.privacyValue;
        }
      })
    };



   /* $scope.data.privacySetting = eval(localStorage.privacy);
    console.log("the value from local",$scope.data.privacySetting)
    $scope.checkBoxChange = function () {
      Crud.create({
        root: "users/privacy_setting.json"
      }, {"user_id": userLogin.user_id, "privacy_setting": $scope.data.privacySetting}, function (response) {
        if (response.status) {
          console.log(response);
          localStorage.privacy = $scope.data.privacySetting;
        }
      })
    }*/


  });
