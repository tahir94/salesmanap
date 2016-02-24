var app = angular.module("starter");
app.constant("firebaseRef", "https://abc12345.firebaseio.com");
app.controller("dashboardController", function ($interval, $location, firebaseRef, $scope, $state, $q, $http, $rootScope, $firebaseArray) {

  var token = localStorage.getItem("firebaseToken");
  firebaseRef = new Firebase(firebaseRef);
  $scope.notifications = $firebaseArray(firebaseRef.child(token));

  $scope.showNotification = function (notification) {
    $scope.notification = notification;
    console.log(notification);

    angular.extend($scope, {
     london: {
     lat: notification.lat,
     lng: notification.long,
     zoom: 17
     },
     defaults: {
     zoomAnimation: false,
     markerZoomAnimation: false,
     fadeAnimation: false
     },
     markers: {
     london: {
       lat: notification.lat,
       lng: notification.long
     }
     }
     });


    $scope.saveNotification();
    $state.go("dashboard.notifications")
  };
  $scope.saveNotification = function () {
    if ($scope.notifications.length) {
      angular.forEach($scope.notifications, function (val) {
        $http.post("/addOrders", val).then(function (success) {
          $scope.notifications.$remove(val);
        }, function (error) {
          console.log(error)
        })
      });
    }
    $http.get("/getOrders/" + token).then(function (success) {
      $scope.mongoNotifications = success.data;
      console.log(success)
    }, function (error) {
      console.log(error)
    })
  };
  $scope.saveNotification();
  $scope.isLoggedIn = true;
  $scope.abc = false;

  $scope.signOut = function () {
    localStorage.removeItem("firebaseToken");
    $state.go("login")
  };


  $http.get("getCompany/" + token).then(function (data) {

      console.log('my data is ', data);
      $scope.abc = true;
      if (data.data == "") {
        $state.go("dashboard.createCompany");
      }
      else {
        $state.go("dashboard.showCompany");
      }

      $scope.getData = data.data;



    }, function (err) {

      console.log(err)
    });


  $scope.addCompany = function (comData) {
    comData.firebaseToken = token;
    $http.post("/createCompany", comData)

      .then(function (data) {
        console.log(comData, token);
        console.log(data);
        console.log(data.data);
        $scope.companyData = data.data.companyName;

      }, function (err) {
        console.log("Error : ", err)
      });
    $state.go("dashboard.showCompany");
  };


  $scope.saleman = {firebaseToken: token};
  $scope.submitUser = function (saleman) {
    console.log(saleman);
      $http.post("/salesman", saleman)
      .then(function (success) {
        console.log(success);
          }, function (err) {
        console.log(err);
      });
      $state.go("dashboard.showCompany")
       };




  $scope.showSalesman = function () {
    $http.get("/getSalesman/" + token).then(function (data) {
      $scope.showData = data.data;
      console.log("data getting successfully ", data);
    }, function (error) {
      console.log("can't get data ", error);
    })

  };





});









