angular.module('ionicApp.pwdSettingsCtrl', [])
    .controller('pwdSettingsCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, Crud) {
        $ionicPlatform.onHardwareBackButton(function () {
            $ionicPlatform.onHardwareBackButton(function () {

                $ionicHistory.goBack();

            }, 100);

        }, 100);


        $scope.validatePwd = function (form) {
            if (form.$valid && userLogin.user_id != "") {
                var changePwd = {};
                changePwd.password = $scope.pwd.password;
                changePwd.old_password = $scope.pwd.old_password;
                changePwd.repeat_password = $scope.pwd.repeat_password;
                changePwd.id = userLogin.user_id;


              if(changePwd.password=== changePwd.repeat_password){
                Crud.create({
                  root: "users/change_password.json"
                }, changePwd, function check(response) {
                  console.log(response);
                  if (response.status || response.message == "success") {
                    $ionicPopup.alert({
                      title: 'Success',
                      content: "Successfully Changed your password"
                    }).then(function (res) {
                      $ionicHistory.goBack();
                      /*$state.go("green.login");
                       $ionicHistory.clearCache();
                       $ionicHistory.clearHistory();
                       $ionicHistory.nextViewOptions({
                       disableBack: true,
                       historyRoot: true
                       });*/
                    });
                    $scope.pwd = {}
                  }
                  else {
                   /* var error_msg = "";
                    for (var key in response.message) {
                      var value = response.message[key];
                      error_msg += "<b>" + key + "</b> - " + value + "<br>";
                    }*/
                    $ionicPopup.alert({
                      title: 'Error',
                      content: "old password is not correct"
                    }).then(function (res) {

                    })
                  }
                });
              }

              else{
                $ionicPopup.alert({
                  title: 'Error',
                  content: "Passwords are not matching"
                }).then(function (res) {

                })
              }


            }
            else {
                $ionicPopup.alert({
                    title: 'Error',
                    content: "Some Fields are missing please Check"
                }).then(function (res) {

                })
            }
        }


    });
