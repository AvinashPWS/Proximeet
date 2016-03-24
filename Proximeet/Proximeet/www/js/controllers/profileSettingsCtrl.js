angular.module('ionicApp.profileSettingsCtrl', [])
    .controller('profileSettingsCtrl', function ($scope, $http, Crud, Camera, Gallery, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, $ionicLoading) {
        $ionicPlatform.onHardwareBackButton(function () {


            console.log("in profile settings");

            $ionicPlatform.onHardwareBackButton(function () {

                $ionicHistory.goBack();

            }, 100);

        }, 100);


        $scope.pro = {};

        $scope.pro.name = localStorage['name'];
        $scope.pro.user_name = localStorage['user_name'];
        $scope.pro.email = localStorage['email'];
        $scope.pro.phone_no = localStorage['phone_no'];
        $scope.pro.address = localStorage['user_loc'];


        var getPhotoCamera = function () {
            Camera.getPicture().then(function (imageURI) {
                $scope.userImg = imageURI;
            }, function (err) {
                console.log(err);
            });
        };


        var getPhotoGallery = function () {
            Gallery.getPicture().then(function (imageURI) {
                $scope.userImg = imageURI;
            }, function (err) {
                console.log(err);
            });
        };


        var profileWithOutImg = function (pObj) {

            //console.log(pObj);
            console.log("without img");

            console.log(pObj);

            Crud.create({
                root: "users/user_update.json"
            }, pObj, function check(response) {
                console.log(response);
                if (response.status) {



                    $ionicPopup.alert({
                        title: 'Success',
                        content: "Successfully updated"
                    }).then(function (res) {
                        //$state.go("green.myAds");
                        //$ionicHistory.clearCache();
                        //$ionicHistory.clearHistory();
                        //$ionicHistory.nextViewOptions({
                        //    disableBack: true,
                        //    historyRoot: true
                        //});
                        $ionicHistory.goBack();
                    });
                    localStorage.name = $scope.pro.name;
                    localStorage.user_name = $scope.pro.user_name;
                    localStorage.phone_no = $scope.pro.phone_no;
                    localStorage.email = $scope.pro.email;
                    localStorage.user_loc = $scope.pro.address;
                    //localStorage.image_path = undefined;
                    $scope.pro = {}
                }
                else {
                    var error_msg = "";
                    for (var key in response.message) {
                        var value = response.message[key];
                        error_msg += "<b>" + key + "</b> - " + value + "<br>";
                    }
                    $ionicPopup.alert({
                        title: 'Error',
                        content: error_msg
                    }).then(function (res) {

                    });


                }
            });
        };

        var profileWithImg = function (file, pObj) {
            console.log("with img");
            console.log(file);
            console.log(pObj);
            $ionicLoading.show({
                template: '<div class="default-loader"><ion-spinner icon="ripple"></ion-spinner></div>'
            })
            var options = new FileUploadOptions();
            options.fileKey = "image_path";
            options.fileName = file.substr(file.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            options.params = pObj;
            options.chunkedMode = false;

            var ft = new FileTransfer();

            ft.onprogress = function () {



            };
            ft.upload(file, $rootScope.ROUTES+"users/user_update.json", win, fail, options);


            function win(r) {
                //localStorage.image_path = r.path;

              console.log("response",r);
              console.log(r.response);
                var string = r.response;
                eval('var obj='+string);
                //console.log(obj.path);
                localStorage.image_path = obj.path;
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: "Success",
                    content: "Successfully uploaded"
                }).then(function (r) {

                    //localStorage.image_path = undefined;
                    $ionicHistory.goBack();
                });


                localStorage.name = $scope.pro.name;
                localStorage.user_name = $scope.pro.user_name;
                localStorage.phone_no = $scope.pro.phone_no;
                localStorage.email = $scope.pro.email;
                localStorage.user_loc = $scope.pro.address;

                $scope.userImg = undefined;
                $scope.pro = {};
            }

            function fail(error) {
                $ionicLoading.hide();
                //alert("An error has occurred: Code = " + error.code);
            }
        };


        $scope.validateProfile = function (form, file) {
            if (form.$valid && userLogin.user_id != "") {
                var profileObj = {};
                profileObj.name = $scope.pro.name;
                profileObj.user_name = $scope.pro.user_name;
                profileObj.email = $scope.pro.email;
                profileObj.phone_no = $scope.pro.phone_no;
                profileObj.address = $scope.pro.address;
                profileObj.user_id = userLogin.user_id;
                profileObj.app_id = 1;
                //console.log(profileObj);
                if (file != undefined) {
                    profileWithImg(file, profileObj)
                } else if (file == undefined) {
                    profileWithOutImg(profileObj)
                }
            }
            else {
                $ionicPopup.alert({
                    title: 'Error',
                    content: "Some Fields are missing please Check"
                }).then(function (res) {

                })
            }
        };


        $scope.showImageSelect = function () {
            $ionicPopup.show({
                template: '',
                title: 'Choose the options below',
                scope: $scope,
                buttons: [

                    {
                        text: '<i class="ionic ion-camera" style="font-size: 1.3em"></i>',
                        type: 'button-block',
                        onTap: function (e) {

                            return 'camera';
                        }
                    }, {
                        text: '<i class="ionic ion-images"></i>',
                        type: 'button-block',
                        onTap: function (e) {
                            return 'gallery';
                        }
                    }, {
                        text: '<i class="ionic ion-close"></i>',
                        type: 'button-block',
                        onTap: function (e) {
                            return 'cancel';
                        }
                    }
                ]
            }).then(function (res) {
                switch (res) {
                    case "camera":
                        console.log("camera");
                        getPhotoCamera();
                        break;
                    case "gallery":
                        getPhotoGallery();
                        console.log("gallery");
                        break;
                    case "cancel":
                        console.log("cancel");
                        $scope.userImg = undefined;
                        break;
                }
            }, function (err) {
                console.log('Err:', err);
            }, function (msg) {
                console.log('message:', msg);
            });

            //$ionicPlatform.on('backbutton', function (e) {
            //    // Execute action
            //    $ionicPopup.hide();
            //});
        }


    });
