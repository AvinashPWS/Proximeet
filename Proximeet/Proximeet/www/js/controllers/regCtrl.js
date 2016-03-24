angular.module('ionicApp.regCtrl', [])
    .controller("regCtrl", function (checkConnection, $scope, $rootScope, $ionicPopup, Crud, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state) {
        $scope.name = $state.current.name;
        $ionicPlatform.onHardwareBackButton(function () {

            $ionicHistory.goBack();

        }, 100);

        $scope.reg = {};



        //alert(checkConnection.isConnection());


        function callAlert(title, content, err) {
            $ionicPopup.alert({
                title: title,
                content: content
            }).then(function (res) {
                if (res) {
                    switch (err) {
                        case "0":
                            console.log("error");
                            break;
                        case "1":
                            $state.go('green.login');
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            break;
                    }
                }


            });
        }
        function validateEmail(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }

        $scope.validateRegister = function (form) {
            if (form.$valid&&validateEmail($scope.reg.email)) {
                $scope.reg.app_id = 1;
                $scope.reg.device_id = localStorage.uuid;
                $scope.reg.device_token = localStorage.reg;

                console.log( $scope.reg);

                Crud.create({
                    root: "users/registration.json"
                }, $scope.reg, function (response) {
                    //console.log(response);
                    if (response.status) {
                      $scope.reg = {};


                      $ionicPopup.alert({
                        title: 'Success',
                        template: "<h6>You have successfully registered, Please Vefiy your number</h6>"
                      }).then(function (success_data) {
                          if(success_data){
                            $scope.verify = {}
                            var verificationPopUp = $ionicPopup.show({
                              template: '<input type="text" ng-model="verify.code" placeholder="Enter the Code here">',
                              title: 'Please verify your number',
                              subTitle: 'Enter the 5 digit code below.',
                              scope: $scope,
                              buttons: [
                                { text: 'Cancel' },
                                {
                                  text: '<b>Send</b>',
                                  type: 'button-positive button-theme ',
                                  onTap: function(e) {
                                    if (!$scope.verify.code) {
                                      //don't allow the user to close unless he enters wifi password
                                      e.preventDefault();
                                    } else {
                                      return $scope.verify.code;
                                    }
                                  }
                                }
                              ]
                            });
                            verificationPopUp.then(function(res) {
                              if(res){


                                Crud.create({root: "users/verify_otp.json"}, {"user_id":response.id,"token":res}, function (response) {
                                  console.log(response);
                                  if(response.status){
                                    $ionicPopup.alert({
                                      title: 'Success',
                                      template: "<h6>Successfully Verified</h6>"
                                    }).then(function (res) {
                                      $ionicHistory.goBack();
                                    });
                                  }else{
                                    $ionicPopup.alert({
                                      title: 'Alert',
                                      template: "<h6>Please try once again later</h6>"
                                    }).then(function (res) {

                                    })
                                  }
                                });


                              }
                            });
                          }
                      })



                        //callAlert("Success", "Successfully Registered", "1")
                      console.log(response);
                    }
                    else {
                        var error_msg = "";
                        for (var key in response.message) {
                            var value = response.message[key];
                            error_msg += "<b>" + key + "</b> - " + value + "<br>";
                        }
                        callAlert("Error", error_msg, "0")
                    }
                })
            }
            else {
                callAlert("Error", "Please check the fields to Register", "0")
            }
        }
    });
