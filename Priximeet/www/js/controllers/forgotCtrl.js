angular.module('ionicApp.forgotCtrl', []).controller("forgotCtrl", function ($scope, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal,
                                                                             $state, Crud) {
  $ionicPlatform.onHardwareBackButton(function (event) {

    $ionicHistory.goBack();


  }, 100)


  function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    return re.test(email);
  }


  $scope.validateEmail = function (form) {
    if (form.$valid && validateEmail($scope.user.email)) {
      Crud.create({
        root: "users/forgot_password.json"
      }, $scope.user, function (response) {
        console.log(response);
        if (response.status) {
          $ionicPopup.alert({
            title: "Success",
            content: "Please check your email address for your login credentials"
          }).then(function (res) {
            if(res){
              $ionicHistory.goBack();
            }else{
              $ionicHistory.goBack();
            }
          })
        } else {

          $ionicPopup.alert({
            title: "Alert",
            content: "Your email address is not available"
          }).then(function (res) {

          })
        }
      })
    } else {
      $ionicPopup.alert({
        title: "Alert",
        content: "Please Enter your Email Address"
      }).then(function (res) {

      })
    }
  }


});
