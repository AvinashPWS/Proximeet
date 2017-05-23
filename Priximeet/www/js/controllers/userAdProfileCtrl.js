




angular.module('ionicApp.userAdProfileCtrl', [])
    .controller('userAdProfileCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, $stateParams, Crud) {
        $scope.name = $state.current.name;


        $ionicPlatform.onHardwareBackButton(function (e) {
            $ionicHistory.goBack();
        }, 100);


        $scope.checkMsg = function (msg) {
            if (msg == '') {
                return {
                    'padding': '0px',
                    'min-height': '0px',
                    'border-bottom':'5px solid  #F1EBE4'
                }
            } else {
                return {
                    'padding': '5px',
                    'min-height': '95px'
                }
            }
        }

        $scope.initShow = false;

        $scope.getRating = function (rating) {
            return ((rating / 5.0) * 100);
        };
        $scope.$on('$ionicView.beforeEnter', function () {
            console.log("state param user id", $stateParams.user_id);
            Crud.create({
                root: "posts/user_post_review.json"
            }, {user_id: $stateParams.user_id}, function check(response) {
                if (response.status) {
                    $scope.initShow = true;
                    console.log(response);
                    $scope.user = response.userDet;
                    $scope.adsReviews = response.result;
                    console.log($scope.adsReviews)
                }

            })
        })


    })
