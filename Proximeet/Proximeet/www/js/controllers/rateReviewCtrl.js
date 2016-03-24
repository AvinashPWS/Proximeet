angular.module('ionicApp.rateReviewCtrl', [])
    .controller('rateReviewCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state,sharableRateReview) {



        $ionicPlatform.onHardwareBackButton(function (e) {
            $ionicHistory.goBack();
        }, 100);


        console.log(sharableRateReview.rateReviewObj);

        $scope.rateReviewArr  = sharableRateReview.arr;
        $scope.getrateWidth = function (rate) {
            return ((rate/5)*100)
        }

        $scope.checkMessage = function (msg) {
            if(msg==""){
                return{
                    "padding":'0px',
                    "margin":"0px"
                }
            }else{
                return{
                    "padding":'5px',
                    "margin":"0px"
                }
            }
        }


    });