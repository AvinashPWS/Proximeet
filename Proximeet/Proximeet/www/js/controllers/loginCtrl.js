angular.module('ionicApp.loginCtrl', ['ngCordova', 'ngCordovaOauth'])
        .controller('loginCtrl', function ($scope, Crud, userLogin, $rootScope, $ionicNavBarDelegate, $ionicPopup,
                $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, $cordovaInAppBrowser, $cordovaOauth, $http) {





            $scope.$on('$ionicView.enter', function () {
                //$ionicNavBarDelegate.showBackButton(false);

            });
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $ionicPlatform.registerBackButtonAction(function () {


                if ($state.current.name == "green.login") {
                    //    $ionicPopup.confirm({
                    //        title: "Exiting app",
                    //        template: 'Are you sure you want to Exit?'
                    //    }).then(function (res) {
                    //        if (res) {
                    //            navigator.app.exitApp();
                    //        }
                    //        else {
                    //            navigator.app.clearHistory();
                    //            $ionicHistory.clearCache();
                    //            $ionicHistory.clearHistory();
                    //        }
                    //    })
                    navigator.app.exitApp();
                }
                //navigator.app.exitApp();
            }, 100);


            //$scope.sample = function () {
            //
            //    $scope.testLog = false;
            //}
            //post user cred to login

            $scope.user = {};

            //850752250567-b6ohj73j0oikm2mm3f6f3nks3kgo84n2.apps.googleusercontent.com
            $scope.loginGoogle = function () {
                
                console.log("google working");
                $cordovaOauth.google("169098113765-co6uq24u6jd1fsdvq4h18kqr63a91na1.apps.googleusercontent.com",
                        ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]).then(function (result) {
                    //alert("Response Object -> " + JSON.stringify(result));
                    localStorage.google_accessToken = result.access_token;

                    $http.get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + localStorage.google_accessToken)
                            .success(function (data, status, headers, config) {

                                var regGoogleObj = {};
                                //alert(JSON.stringify(data));

                                if (localStorage.uuid && localStorage.reg) {
                                    regGoogleObj.device_id = localStorage.uuid;
                                    regGoogleObj.device_token = localStorage.reg;
                                } else {
                                    regGoogleObj.device_id = sessionStorage.uuid;
                                    regGoogleObj.device_token = sessionStorage.reg;
                                }
                                ;

                                console.log("google data", data);

                                Crud.create({root: "users/rest_email_check.json"}, {"email": data.email}, function (response) {
                                    if (response.status) {
                                        console.log("user old data", response);
                                        if (response.result.User.phone_verify == "1") {
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


                                            $state.go('green.search');
                                            $ionicHistory.clearCache();
                                            $ionicHistory.clearHistory();
                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });
                                        } else {
                                            //phone start

                                            $scope.tempphone = {};
                                            var phoneNumber = $ionicPopup.show({
                                                template: '<input type="tel" ng-model="tempphone.phone" placeholder="Enter the Phone Number">',
                                                title: 'Please Enter your Phone Number',
                                                scope: $scope,
                                                buttons: [
                                                    {
                                                        text: '<b>Send</b>',
                                                        type: 'button-positive button-theme ',
                                                        onTap: function (e) {
                                                            if (!$scope.tempphone.phone) {
                                                                //don't allow the user to close unless he enters wifi password
                                                                e.preventDefault();
                                                            } else {
                                                                return $scope.tempphone.phone;
                                                            }
                                                        }
                                                    }
                                                ]
                                            });
                                            phoneNumber.then(function (res) {
                                                if (res) {

                                                    console.log("google data", regGoogleObj)
                                                    Crud.create({root: "users/resend_otp.json"}, {"user_id": response.result.User.user_id, phone_no: res}, function (response) {
                                                        if (response.status) {
                                                            $scope.verify = {};
                                                            var verificationPopUp = $ionicPopup.show({
                                                                template: '<input type="number" ng-model="verify.code" placeholder="Enter the Code here">',
                                                                title: 'Please verify your number',
                                                                subTitle: 'Enter the 5 digit code below.',
                                                                scope: $scope,
                                                                buttons: [
                                                                    {text: 'Cancel'},
                                                                    {
                                                                        text: '<b>Send</b>',
                                                                        type: 'button-positive button-theme ',
                                                                        onTap: function (e) {
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
                                                            verificationPopUp.then(function (res) {
                                                                if (res) {


                                                                    Crud.create({root: "users/verify_otp.json"}, {"user_id": $scope.tem_user_id, "token": res}, function (response) {
                                                                        console.log(response);

                                                                        if (response.status) {
                                                                            sessionStorage.clear();
                                                                            localStorage.name = response.user.User.name;
                                                                            localStorage.user_name = response.user.User.user_name;
                                                                            localStorage.phone_no = response.user.User.phone_no;
                                                                            localStorage.email = $scope.user.email;
                                                                            localStorage.email_verify = response.user.User.email_verify;
                                                                            localStorage.image_path = response.user.User.image_path;
                                                                            localStorage.user_id = $scope.tem_user_id;
                                                                            localStorage.user_loc = response.user.User.address;
                                                                            localStorage.privacy = response.user.User.privacy_setting;
                                                                            localStorage.loginMethod = "google";
                                                                            $scope.testLog = true;
                                                                            userLogin.setLoginStat(true);
                                                                            userLogin.setUserId($scope.tem_user_id);

                                                                            //$scope.user = {};
                                                                            $state.go('green.search');
                                                                            $ionicHistory.clearCache();
                                                                            $ionicHistory.clearHistory();
                                                                            $ionicHistory.nextViewOptions({
                                                                                disableBack: true
                                                                            });
                                                                            $ionicPopup.alert({
                                                                                title: 'Success',
                                                                                template: "<h6>Successfully Verified</h6>"
                                                                            }).then(function (response) {

                                                                            });
                                                                        } else {
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
                                                    });
                                                }
                                            });
                                        }


                                    } else {


                                        //phone start

                                        $scope.tempphone = {};
                                        var phoneNumber = $ionicPopup.show({
                                            template: '<input type="tel" ng-model="tempphone.phone" placeholder="Enter the Phone Number">',
                                            title: 'Please Enter your Phone Number',
                                            scope: $scope,
                                            buttons: [
                                                {
                                                    text: '<b>Send</b>',
                                                    type: 'button-positive button-theme ',
                                                    onTap: function (e) {
                                                        if (!$scope.tempphone.phone) {
                                                            //don't allow the user to close unless he enters wifi password
                                                            e.preventDefault();
                                                        } else {
                                                            return $scope.tempphone.phone;
                                                        }
                                                    }
                                                }
                                            ]
                                        });
                                        phoneNumber.then(function (res) {
                                            
                                            if (res) {

                                                console.log(data);
                                                regGoogleObj.name = data.name;
                                                regGoogleObj.user_name = data.given_name;
                                                regGoogleObj.email = data.email;
                                                regGoogleObj.phone_no = $scope.tempphone.phone;
                                                regGoogleObj.social_network = "google";
                                                regGoogleObj.image_path = data.picture;
                                                regGoogleObj.app_id = 1;

                                                if (localStorage.uuid && localStorage.reg) {
                                                    regGoogleObj.device_id = localStorage.uuid;
                                                    regGoogleObj.device_token = localStorage.reg;
                                                } else {
                                                    regGoogleObj.device_id = sessionStorage.uuid;
                                                    regGoogleObj.device_token = sessionStorage.reg;
                                                }
                                                ;

                                                console.log("google data", regGoogleObj)
                                                Crud.create({
                                                    root: "users/rest_social_register.json"
                                                }, regGoogleObj, function (response) {

                                                    console.log(response);
                                                    if (response.status) {

                                                        //console.log(response);
                                                        /*localStorage.name = data.name;
                                                         localStorage.user_name = data.given_name;
                                                         localStorage.phone_no = 0;
                                                         localStorage.email = data.email;
                                                         localStorage.image_path = data.picture;
                                                         localStorage.user_id = response.id;
                                                         localStorage.privacy = response.user.User.privacy_setting;
                                                         $scope.testLog = true;
                                                         localStorage.loginMethod = "google";
                                                         sessionStorage.clear();
                                                         userLogin.setLoginStat(true);
                                                         userLogin.setUserId(response.id);*/

                                                        sessionStorage.clear();
                                                        localStorage.name = response.user.User.name;
                                                        localStorage.user_name = response.user.User.user_name;
                                                        localStorage.phone_no = response.user.User.phone_no;
                                                        localStorage.email = response.user.User.email;
                                                        localStorage.email_verify = response.user.User.email_verify;
                                                        localStorage.image_path = response.user.User.image_path;
                                                        localStorage.user_id = response.user.User.user_id;
                                                        localStorage.user_loc = response.user.User.address;
                                                        localStorage.privacy = response.user.User.privacy_setting;
                                                        localStorage.loginMethod = "google";
                                                        $scope.testLog = true;
                                                        userLogin.setLoginStat(true);
                                                        userLogin.setUserId(response.user.User.user_id);


                                                        $state.go('green.search');
                                                        $ionicHistory.clearCache();
                                                        $ionicHistory.clearHistory();
                                                        $ionicHistory.nextViewOptions({
                                                            disableBack: true
                                                        });

                                                    } else if (response.verified == false) {
                                                        var user_id_google = response.id;
                                                        $scope.verify = {};
                                                        var verificationPopUp = $ionicPopup.show({
                                                            template: '<input type="number" ng-model="verify.code" placeholder="Enter the Code here">',
                                                            title: 'Please verify your number',
                                                            subTitle: 'Enter the 5 digit code below.',
                                                            scope: $scope,
                                                            buttons: [
                                                                {text: 'Cancel'},
                                                                {
                                                                    text: '<b>Send</b>',
                                                                    type: 'button-positive button-theme ',
                                                                    onTap: function (e) {
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
                                                        verificationPopUp.then(function (res) {
                                                            if (res) {


                                                                Crud.create({root: "users/verify_otp.json"}, {"user_id": user_id_google, "token": res}, function (response) {
                                                                    console.log("google final res", response);

                                                                    if (response.status) {
                                                                        sessionStorage.clear();
                                                                        localStorage.name = response.user.User.name;
                                                                        localStorage.user_name = response.user.User.user_name;
                                                                        localStorage.phone_no = response.user.User.phone_no;
                                                                        localStorage.email = response.user.User.email;
                                                                        localStorage.email_verify = response.user.User.email_verify;
                                                                        localStorage.image_path = response.user.User.image_path;
                                                                        localStorage.user_id = response.user.User.user_id;
                                                                        localStorage.user_loc = response.user.User.address;
                                                                        localStorage.privacy = response.user.User.privacy_setting;
                                                                        localStorage.loginMethod = "google";
                                                                        $scope.testLog = true;
                                                                        userLogin.setLoginStat(true);
                                                                        userLogin.setUserId(response.user.User.user_id);

                                                                        //$scope.user = {};
                                                                        $state.go('green.search');
                                                                        $ionicHistory.clearCache();
                                                                        $ionicHistory.clearHistory();
                                                                        $ionicHistory.nextViewOptions({
                                                                            disableBack: true
                                                                        });
                                                                        $ionicPopup.alert({
                                                                            title: 'Success',
                                                                            template: "<h6>Successfully Verified</h6>"
                                                                        }).then(function (response) {

                                                                        });
                                                                    } else {
                                                                        $ionicPopup.alert({
                                                                            title: 'Alert',
                                                                            template: "<h6>Please try once again later</h6>"
                                                                        }).then(function (res) {

                                                                        })
                                                                    }
                                                                });


                                                            }
                                                        });
                                                    } else {
                                                        $ionicPopup.alert({
                                                            title: 'Alert',
                                                            template: "<h6>Email or phone no is already in use</h6>"
                                                        }).then(function (res) {

                                                        })
                                                    }
                                                });
                                            }
                                        });

                                        //phone end
                                    }
                                });






                                //alert(JSON.stringify(regGoogleObj));
                            })
                            .error(function (data, status, headers, config) {
                                alert(JSON.stringify(data));
                            });

                }, function (error) {
                    console.log("Error -> " + error);
                });


            }

            $scope.loginFacebook = function () {
                
                console.log("facebook working");
                $cordovaOauth.facebook("844048098999098", ["email", "read_stream", "user_website", "user_location", "user_relationships", "public_profile"]).then(function (result) {
                    localStorage.facebook_accessToken = result.access_token;
                    console.log(result);

                    $http.get("https://graph.facebook.com/v2.2/me", {
                        params: {
                            access_token: result.access_token,
                            fields: "id,name,gender,location,website,picture,relationship_status,email",
                            format: "json"
                        }
                    }).then(function (result) {
                        console.log(result.data);


                        var regFacebookObj = {};
                        if (localStorage.uuid && localStorage.reg) {
                            regFacebookObj.device_id = localStorage.uuid;
                            regFacebookObj.device_token = localStorage.reg;
                        } else {
                            regFacebookObj.device_id = sessionStorage.uuid;
                            regFacebookObj.device_token = sessionStorage.reg;
                        }

                        //alert(JSON.stringify(data));

                        console.log("facebook obj --->", regFacebookObj);
                        Crud.create({root: "users/rest_email_check.json"}, {"email": result.data.email}, function (response) {
                            if (response.status) {
                                if (response.result.User.phone_verify == "1") {
                                    console.log("user old data", response);

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
                                    localStorage.loginMethod = "facebook";
                                    $scope.testLog = true;
                                    userLogin.setLoginStat(true);
                                    userLogin.setUserId(response.result.User.user_id);


                                    $state.go('green.search');
                                    $ionicHistory.clearCache();
                                    $ionicHistory.clearHistory();
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });

                                } else {
                                    $scope.tempphone = {};
                                    var phoneNumber = $ionicPopup.show({
                                        template: '<input type="tel" ng-model="tempphone.phone" placeholder="Enter the Phone Number">',
                                        title: 'Please Enter your Phone Number',
                                        scope: $scope,
                                        buttons: [
                                            {
                                                text: '<b>Send</b>',
                                                type: 'button-positive button-theme ',
                                                onTap: function (e) {
                                                    if (!$scope.tempphone.phone) {
                                                        //don't allow the user to close unless he enters wifi password
                                                        e.preventDefault();
                                                    } else {
                                                        return $scope.tempphone.phone;
                                                    }
                                                }
                                            }
                                        ]
                                    });
                                    //seresresres
                                    phoneNumber.then(function (res) {
                                        if (res) {


                                            Crud.create({root: "users/resend_otp.json"}, {"user_id": response.result.User.user_id, phone_no: res}, function (response) {
                                                if (response.status) {
                                                    $scope.verify = {};
                                                    var verificationPopUp = $ionicPopup.show({
                                                        template: '<input type="number" ng-model="verify.code" placeholder="Enter the Code here">',
                                                        title: 'Please verify your number',
                                                        subTitle: 'Enter the 5 digit code below.',
                                                        scope: $scope,
                                                        buttons: [
                                                            {text: 'Cancel'},
                                                            {
                                                                text: '<b>Send</b>',
                                                                type: 'button-positive button-theme ',
                                                                onTap: function (e) {
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
                                                    verificationPopUp.then(function (res) {
                                                        if (res) {


                                                            Crud.create({root: "users/verify_otp.json"}, {"user_id": $scope.tem_user_id, "token": res}, function (response) {
                                                                console.log(response);

                                                                if (response.status) {
                                                                    sessionStorage.clear();
                                                                    localStorage.name = response.user.User.name;
                                                                    localStorage.user_name = response.user.User.user_name;
                                                                    localStorage.phone_no = response.user.User.phone_no;
                                                                    localStorage.email = response.user.User.email;
                                                                    localStorage.email_verify = response.user.User.email_verify;
                                                                    localStorage.image_path = response.user.User.image_path;
                                                                    localStorage.user_id = $scope.tem_user_id;
                                                                    localStorage.user_loc = response.user.User.address;
                                                                    localStorage.privacy = response.user.User.privacy_setting;
                                                                    localStorage.loginMethod = "facebook";
                                                                    $scope.testLog = true;
                                                                    userLogin.setLoginStat(true);
                                                                    userLogin.setUserId($scope.tem_user_id);

                                                                    //$scope.user = {};
                                                                    $state.go('green.search');
                                                                    $ionicHistory.clearCache();
                                                                    $ionicHistory.clearHistory();
                                                                    $ionicHistory.nextViewOptions({
                                                                        disableBack: true
                                                                    });
                                                                    $ionicPopup.alert({
                                                                        title: 'Success',
                                                                        template: "<h6>Successfully Verified</h6>"
                                                                    }).then(function (response) {

                                                                    });
                                                                } else {
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
                                            });
                                        }
                                    });
                                }

                            } else {



                                $scope.tempphone = {};
                                var phoneNumber = $ionicPopup.show({
                                    template: '<input type="tel" ng-model="tempphone.phone" placeholder="Enter the Phone Number">',
                                    title: 'Please Enter your Phone Number',
                                    scope: $scope,
                                    buttons: [
                                        {
                                            text: '<b>Send</b>',
                                            type: 'button-positive button-theme ',
                                            onTap: function (e) {
                                                if (!$scope.tempphone.phone) {
                                                    //don't allow the user to close unless he enters wifi password
                                                    e.preventDefault();
                                                } else {
                                                    return $scope.tempphone.phone;
                                                }
                                            }
                                        }
                                    ]
                                });
                                phoneNumber.then(function (res) {
                                    console.log(result.data);
                                    regFacebookObj.name = result.data.name;
                                    regFacebookObj.user_name = result.data.name;
                                    regFacebookObj.email = result.data.email;
                                    regFacebookObj.phone_no = $scope.tempphone.phone;
                                    regFacebookObj.social_network = "facebook";
                                    regFacebookObj.image_path = 'http://graph.facebook.com/' + result.data.id + '/picture?type=normal';
                                    regFacebookObj.address = "";
                                    regFacebookObj.app_id = 1;

                                    if (localStorage.uuid && localStorage.reg) {
                                        regFacebookObj.device_id = localStorage.uuid;
                                        regFacebookObj.device_token = localStorage.reg;
                                    } else {
                                        regFacebookObj.device_id = sessionStorage.uuid;
                                        regFacebookObj.device_token = sessionStorage.reg;
                                    }
                                    ;

                                    console.log("facebook obj --->", regFacebookObj);

                                    Crud.create({
                                        root: "users/rest_social_register.json"
                                    }, regFacebookObj, function (response) {
                                        console.log(response);

                                        console.log(response);
                                        if (response.status) {

                                            //console.log(response);
                                            /*localStorage.name = data.name;
                                             localStorage.user_name = data.given_name;
                                             localStorage.phone_no = 0;
                                             localStorage.email = data.email;
                                             localStorage.image_path = data.picture;
                                             localStorage.user_id = response.id;
                                             localStorage.privacy = response.user.User.privacy_setting;
                                             $scope.testLog = true;
                                             localStorage.loginMethod = "google";
                                             sessionStorage.clear();
                                             userLogin.setLoginStat(true);
                                             userLogin.setUserId(response.id);*/

                                            sessionStorage.clear();
                                            localStorage.name = response.user.User.name;
                                            localStorage.user_name = response.user.User.user_name;
                                            localStorage.phone_no = response.user.User.phone_no;
                                            localStorage.email = regFacebookObj.email;
                                            localStorage.email_verify = response.user.User.email_verify;
                                            localStorage.image_path = response.user.User.image_path;
                                            localStorage.user_id = response.user.User.user_id;
                                            localStorage.user_loc = response.user.User.address;
                                            localStorage.privacy = response.user.User.privacy_setting;
                                            localStorage.loginMethod = "facebook";
                                            $scope.testLog = true;
                                            userLogin.setLoginStat(true);
                                            userLogin.setUserId(response.user.User.user_id);


                                            $state.go('green.search');
                                            $ionicHistory.clearCache();
                                            $ionicHistory.clearHistory();
                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });

                                        } else if (response.verified == false) {
                                            var user_id_google = response.id;
                                            $scope.verify = {};
                                            var verificationPopUp = $ionicPopup.show({
                                                template: '<input type="number" ng-model="verify.code" placeholder="Enter the Code here">',
                                                title: 'Please verify your number',
                                                subTitle: 'Enter the 5 digit code below.',
                                                scope: $scope,
                                                buttons: [
                                                    {text: 'Cancel'},
                                                    {
                                                        text: '<b>Send</b>',
                                                        type: 'button-positive button-theme ',
                                                        onTap: function (e) {
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
                                            verificationPopUp.then(function (res) {
                                                if (res) {


                                                    Crud.create({root: "users/verify_otp.json"}, {"user_id": user_id_google, "token": res}, function (response) {
                                                        console.log("google final res", response);

                                                        if (response.status) {
                                                            sessionStorage.clear();
                                                            localStorage.name = response.user.User.name;
                                                            localStorage.user_name = response.user.User.user_name;
                                                            localStorage.phone_no = response.user.User.phone_no;
                                                            localStorage.email = regFacebookObj.email;
                                                            localStorage.email_verify = response.user.User.email_verify;
                                                            localStorage.image_path = response.user.User.image_path;
                                                            localStorage.user_id = response.user.User.user_id;
                                                            localStorage.user_loc = response.user.User.address;
                                                            localStorage.privacy = response.user.User.privacy_setting;
                                                            localStorage.loginMethod = "facebook";
                                                            $scope.testLog = true;
                                                            userLogin.setLoginStat(true);
                                                            userLogin.setUserId(response.user.User.user_id);

                                                            //$scope.user = {};
                                                            $state.go('green.search');
                                                            $ionicHistory.clearCache();
                                                            $ionicHistory.clearHistory();
                                                            $ionicHistory.nextViewOptions({
                                                                disableBack: true
                                                            });
                                                            $ionicPopup.alert({
                                                                title: 'Success',
                                                                template: "<h6>Successfully Verified</h6>"
                                                            }).then(function (response) {

                                                            });
                                                        } else {
                                                            $ionicPopup.alert({
                                                                title: 'Alert',
                                                                template: "<h6>Please try once again later</h6>"
                                                            }).then(function (res) {

                                                            })
                                                        }
                                                    });


                                                }
                                            });
                                        } else {
                                            $ionicPopup.alert({
                                                title: 'Alert',
                                                template: "<h6>Email or phone no is already in use</h6>"
                                            }).then(function (res) {

                                            })
                                        }

                                        /*if (response.status) {
                                         localStorage.name = result.data.name;
                                         localStorage.user_name = result.data.name;
                                         localStorage.phone_no = 0;
                                         localStorage.email = result.data.email;
                                         localStorage.image_path = 'http://graph.facebook.com/' + result.data.id + '/picture?type=normal';
                                         localStorage.user_id = response.id;
                                         localStorage.user_loc = "";
                                         localStorage.privacy = response.user.User.privacy_setting;
                                         sessionStorage.clear();
                                         $scope.testLog = true;
                                         userLogin.setLoginStat(true);
                                         userLogin.setUserId(response.id);
                                         localStorage.loginMethod = "facebook";
                                         
                                         $state.go('green.search');
                                         $ionicHistory.clearCache();
                                         $ionicHistory.clearHistory();
                                         $ionicHistory.nextViewOptions({
                                         disableBack: true
                                         });
                                         }*/
                                    })


                                })




                            }
                        });




                    }, function (error) {
                        //alert("There was a problem getting your profile.  Check the logs for details.");
                        console.log(error);
                    });

                }, function (error) {
                    //alert("There was a problem signing in!  See the console for logs");
                    console.log(error);
                });

            }


            function callAlert(title, content, err) {
                $ionicPopup.alert({
                    title: title,
                    content: content
                }).then(function (res) {
                    if (res) {
                        switch (err) {
                            case "0":
                                break;
                            case "1":
                                //$scope.user = {};
                                $state.go('green.search');
                                $ionicHistory.clearCache();
                                $ionicHistory.clearHistory();
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

            $scope.validateLogin = function (form) {
                $scope.testLog = false;
                if (form.$valid && validateEmail($scope.user.email)) {

                    if (localStorage.uuid && localStorage.reg) {
                        $scope.user.device_id = localStorage.uuid;
                        $scope.user.device_token = localStorage.reg;
                    } else {
                        $scope.user.device_id = sessionStorage.uuid;
                        $scope.user.device_token = sessionStorage.reg;
                    }

                    console.log($scope.user)
                    Crud.create({
                        root: "users/login.json"
                    }, $scope.user, function (response) {


                        console.log(response);


                        console.log(response);
                        console.log(localStorage);
                        if (response.status) {
                            sessionStorage.clear();
                            localStorage.name = response.user.User.name;
                            localStorage.user_name = response.user.User.user_name;
                            localStorage.phone_no = response.user.User.phone_no;
                            localStorage.email = $scope.user.email;
                            localStorage.email_verify = response.user.User.email_verify;
                            localStorage.image_path = response.user.User.image_path;
                            localStorage.user_id = response.user.User.user_id;
                            localStorage.user_loc = response.user.User.address;
                            localStorage.privacy = response.user.User.privacy_setting;
                            localStorage.loginMethod = "normal";
                            $scope.testLog = true;
                            userLogin.setLoginStat(true);
                            userLogin.setUserId(response.id);

                            //$scope.user = {};
                            $state.go('green.search');
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });

                            //callAlert("Success", "You are successfully logged in", "1")
                        } else if (response.verified == false) {
                            $scope.tem_user_id = response.user_id;
                            $ionicPopup.alert({
                                title: "Alert",
                                content: response.message
                            }).then(function (res) {
                                if (res) {
                                    console.log({"user_id": $scope.tem_user_id, "phone_no": response})
                                    Crud.create({root: "users/resend_otp.json"}, {"user_id": $scope.tem_user_id, "phone_no": response.phone_no}, function (response) {
                                        if (response.status) {
                                            $scope.verify = {};
                                            var verificationPopUp = $ionicPopup.show({
                                                template: '<input type="number" ng-model="verify.code" placeholder="Enter the Code here">',
                                                title: 'Please verify your number',
                                                subTitle: 'Enter the 5 digit code below.',
                                                scope: $scope,
                                                buttons: [
                                                    {text: 'Cancel'},
                                                    {
                                                        text: '<b>Send</b>',
                                                        type: 'button-positive button-theme ',
                                                        onTap: function (e) {
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
                                            verificationPopUp.then(function (res) {
                                                if (res) {


                                                    Crud.create({root: "users/verify_otp.json"}, {"user_id": $scope.tem_user_id, "token": res}, function (response) {
                                                        console.log(response);

                                                        if (response.status) {
                                                            sessionStorage.clear();
                                                            localStorage.name = response.user.User.name;
                                                            localStorage.user_name = response.user.User.user_name;
                                                            localStorage.phone_no = response.user.User.phone_no;
                                                            localStorage.email = $scope.user.email;
                                                            localStorage.email_verify = response.user.User.email_verify;
                                                            localStorage.image_path = response.user.User.image_path;
                                                            localStorage.user_id = $scope.tem_user_id;
                                                            localStorage.user_loc = response.user.User.address;
                                                            localStorage.privacy = response.user.User.privacy_setting;
                                                            localStorage.loginMethod = "normal";
                                                            $scope.testLog = true;
                                                            userLogin.setLoginStat(true);
                                                            userLogin.setUserId($scope.tem_user_id);

                                                            //$scope.user = {};
                                                            $state.go('green.search');
                                                            $ionicHistory.clearCache();
                                                            $ionicHistory.clearHistory();
                                                            $ionicHistory.nextViewOptions({
                                                                disableBack: true
                                                            });
                                                            $ionicPopup.alert({
                                                                title: 'Success',
                                                                template: "<h6>Successfully Verified</h6>"
                                                            }).then(function (response) {

                                                            });
                                                        } else {
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
                                    });

                                }
                            });
                        } else {
                            callAlert("Error", response.message, "0")

                        }

                    })
                } else {
                    callAlert("Error Logging", "Please enter proper fields and try", "0")
                }
            };


            $scope.gotoReg = function () {
                $state.go('green.reg');
                $ionicHistory.nextViewOptions({
                    disableBack: false
                });
            };
            $scope.gotoForgot = function () {
                $state.go('green.forgot');
                $ionicHistory.nextViewOptions({
                    disableBack: false
                });
            }

            //$scope.regId = "";
            //
            //$scope.getReg = function () {
            //    $scope.regId = localStorage.reg;
            //}
        });
