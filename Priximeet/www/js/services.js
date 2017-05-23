angular.module('ionicApp.services', [])
  .service('userLogin', function ($q) {
    var self = this,
      defer = $q.defer();

    this.isLoggedIn = false;
    this.user_id = "";

    this.observeLoginStat = function () {
      return defer.promise;
    };

    this.setLoginStat = function (logi) {
      self.isLoggedIn = logi;
      defer.notify(self.isLoggedIn);
    };

    this.setUserId = function (id) {
      self.user_id = id;
    };
  })
  .service('latlong', function ($http) {
    delete $http.defaults.headers.common['X-Requested-With'];
    this.goGet = function (address, callbackFunc) {
      $http({
        method: 'GET',
        url: 'http://maps.google.com/maps/api/geocode/json?address=' + address + '&sensor=false'

        //headers: {'Authorization': 'Token token=xxxxYYYYZzzz'}
      }).success(function (data) {

        callbackFunc(data);
      }).error(function () {
        //alert("error");
      });
    }
  })

  .service("addressService", function ($http) {
    delete $http.defaults.headers.common['X-Requested-With'];
    this.goGet = function (lat, lon, callbackFunc) {
      $http({
        method: 'GET',
        url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&sensor=true'

        //headers: {'Authorization': 'Token token=xxxxYYYYZzzz'}
      }).success(function (data) {
        callbackFunc(data.results[0].formatted_address);
      }).error(function () {
        //alert("error");
      });
    }
  })

  .service('cardService', function () {
    var t = this;
    this.data = {"cardFlag": 0};
    this.data = {"resArr": []}


  })

  .service('listMap', function ($q) {
    var self = this,
      defer = $q.defer();

    this.lists = [];


    this.setListArr = function (arr) {
      self.list = arr;
      defer.notify(self.list);
    };

    this.getListArr = function () {
      return defer.promise;
    };


  })
  .service('checkConnection', function () {
    this.isConnection = function () {
      if (navigator.connection.type == Connection.NONE) {
        return false
      }
      else {
        return true;
      }
    }
  }).service('hiLightService', function () {
    //this.hiLightArr = [];
    this.hiLightArr = {};
  }).service("chatData", function () {
    this.setChatObj = function (obj) {
      this.userChatInfo = obj;
    };
    this.getChatObj = function () {
      return this.userChatInfo;
    };
    this.ensureSamePost = function (post_id) {
      //todo
    }
    this.ensureSameSubscriber = function (sub_id) {
      //todo
      return this.getChatObj()["subscriber_id"] == sub_id;
    }


  })
