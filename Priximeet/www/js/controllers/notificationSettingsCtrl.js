angular.module('ionicApp.notificationSettingsCtrl', [])
  .controller('notificationSettingsCtrl', function ($scope, userLogin, $rootScope, $ionicPopup, $templateCache, $ionicPlatform, $ionicHistory, $ionicModal, $state, Crud) {
    $ionicPlatform.onHardwareBackButton(function (event) {

      $ionicPlatform.onHardwareBackButton(function () {

        $ionicHistory.goBack();

      }, 100);

    }, 100)

    Crud.create({root: "categories/notifications.json"}, {"user_id": localStorage.user_id}, function (response) {
      console.log(response.result.UserNotification);
      $scope.chatNotification = response.result.UserNotification.chat;
      $scope.eventUpdateNotification = response.result.UserNotification.post_edit;
    });


    $scope.chatNotificationChange = function () {
      $scope.chatNotification = !$scope.chatNotification;
      $scope.chatData = ($scope.chatNotification == true) ? 1 : 0;
      console.log($scope.chatData);
      Crud.create({root: "categories/edit_notification.json"}, {"user_id": localStorage.user_id,chat:$scope.chatData}, function (response) {
        console.log(response)
      })
    }
    $scope.eventUpdateNotificationChanged = function () {
      $scope.eventUpdateNotification = !$scope.eventUpdateNotification;
      $scope.eventUpdateData = ($scope.eventUpdateNotification == true) ? 1 : 0;
      console.log($scope.eventUpdateData);
      Crud.create({root: "categories/edit_notification.json"}, {"user_id": localStorage.user_id,post_edit:$scope.eventUpdateData}, function (response) {
        console.log(response)
      })
    }


  });
