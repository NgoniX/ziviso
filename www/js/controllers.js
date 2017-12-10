angular.module('ziviso.controllers', []);


// Login Controller


app.controller('LoginCtrl', function($scope, $document, $localStorage, $ionicLoading, authService, $state) {

 //localStorage.clear();
 console.log(localStorage.getItem('access_token'));
  // Perform the login action when the user submits the login form
  $scope.doLogin = function(userLogin) {
    

    if($document[0].getElementById("user_name").value != "" && $document[0].getElementById("user_pass").value != ""){

      $ionicLoading.show({
               template: 'Please Wait...'
      });

      authService.login(userLogin.username, userLogin.password)
      .then((data) => {

         $scope.information = data;
         // console.log(JSON.stringify($scope.information.data.token_type));
        // localStorage.setItem("access_token", user.access_token);
        if($scope.information.data.access_token !== null && data.status === 200){

          $ionicLoading.hide();
          $state.go("app.feed");
          localStorage.setItem("access_token", $scope.information.data.access_token);

          console.log(data.status);

        }

      }).catch((err) => {
        $ionicLoading.hide();
        alert('Login failed. Please try again');
        console.log(err);
      });


    }

    else{

        alert('Please enter username and/or password');
        return false;

    }//end check client username password

    
  };// end $scope.doLogin()

}); 


app.controller('AppCtrl', function($scope, $rootScope, authService, $localStorage, $document, $state, $ionicPopup) {

  // get user info
  authService.userInfo().then((data) => {

         $scope.information = data;

         $rootScope.name = $scope.information.data.name;
         $rootScope.email = $scope.information.data.email;

      }).catch((err) => {
        console.log(err);
      });
  ////////////////////////////////////

  $scope.doLogout = function(){

    var confirmPopup = $ionicPopup.confirm({
     title: 'Logout',
     template: 'Are you sure you want to logout?'
   });

   confirmPopup.then(function(res) {
     if(res) {
      
        // Sign-out successful.
        
        authService.logout();
        $state.go("login");
        
     } else {
       // Code to be executed on pressing cancel or negative response
     }
   });


};// end dologout()



});


app.controller('ResetCtrl', function($scope, $state, $document, $ionicLoading, authService) {

$scope.doReset = function(userReset) {

    //console.log(userReset);

       $ionicLoading.show({
               template: 'Loading...'
              });

        authService.resetPass(userReset.current_password, userReset.password, 
        userReset.password_confirmation).then((data) => {

          $ionicLoading.hide();
          alert('Password Reset Successful.');
          console.log(JSON.stringify(data));
          $state.go("login");


      }).catch((err) => {
        $ionicLoading.hide();
        alert('Password Reset failed. Please try again');
        console.log(err);
      });


    
  };// end $scope.doReset()
  
  
  
});



app.controller('SignupCtrl', function($scope, $state, $ionicLoading, authService) {


$scope.doSignup = function(userSignup) {
    
      $ionicLoading.show({
               template: 'Please Wait...'
      });

      authService.signup(userSignup.fullname, userSignup.email, userSignup.phone, 
        userSignup.profile, userSignup.username, userSignup.password, 
        userSignup.password_confirmation, userSignup.country).then((data) => {

          $ionicLoading.hide();
          alert('Sign Up Successful. Please check your email to confirm');
          console.log(data);
          $state.go("login");


      }).catch((err) => {
        $ionicLoading.hide();
        alert('Sign Up failed. Please try again');
        console.log(err);
      });


    
  };// end $scope.doSignup()

  
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
///

app.controller('FeedCtrl', function ($scope, $localStorage, $ionicHistory, $log, $window, $ionicPopup, $filter, $ionicLoading, $http, FeedData, $ionicFilterBar, $cordovaNetwork) {
   
    $log.info('Feed Controller Created');

    const token = localStorage.getItem('access_token');

    //function that shows if user has read the message
   
    $scope.read = function(feedId) {

      //This will hide the new badge
      document.getElementById("badge_"+feedId).style.display = 'none'; 

        var link = 'http://ziviso.afri-teq.com/api/messages/'+feedId+'/read';

            $http({
            url: link,
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token
            }
            }).then(function (data, status, headers, config){

               $log.info('message read!');

            }, function (data, status, headers, config) {
             $log.info('error: ' + JSON.stringify(data));
            });

    }
    ///////////////////////////////////////////////////////////////////

    $ionicLoading.show({
               template: 'Loading...'
              });

    //get feed function
    $scope.getFeed = function(){

    const token = localStorage.getItem('access_token');

    $http.get('http://ziviso.afri-teq.com/api/messages', 
      { 
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      }).success(function (data, status, headers, config) {

        var feed_data = JSON.stringify(data);

        $log.info('getting data');
        FeedData.initData(data);
        $scope.feeds = FeedData.getFeeds();
        $ionicLoading.hide();

        window.localStorage.setItem("feeds", feed_data);

        $log.info('data saved');
      }).
      error(function () {
        //$log.info('error' + data);
        if(window.localStorage.getItem("feeds") !== undefined) {
          $ionicLoading.hide();
          $scope.feeds = JSON.parse(window.localStorage.getItem("feeds"));
        }
      });

    };


    //remove list item from feed
    $scope.delItem = function(index, feedId){

        $scope.feeds.splice(index, 1);

        //delete the message
         var link = 'http://ziviso.afri-teq.com/api/messages/'+feedId+'/delete';

            $http({
            url: link,
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token
            }
            }).then(function (data, status, headers, config){

               $log.info('message deleted!');

            }, function (data, status, headers, config) {
             $log.info('error: ' + JSON.stringify(data));
            });
            // end

    };

    ////////////////////////////////////////////////////////////////////////


    
    // get feed here
    $scope.getFeed();

    //get feed function
    $scope.refreshFeed = function(){

      $scope.getFeed();
      $scope.$broadcast('scroll.refreshComplete');

    };




      $scope.showFilterBar = function () {
      var filterBarInstance = $ionicFilterBar.show({
        cancelText: "<i class='ion-ios-close-outline'></i>",
        items: $scope.feeds,
        update: function (filteredItems, filterText) {
          $scope.feeds = filteredItems;
        }
      });
    };



  });
  

  app.controller('FeedDetailCtrl', function ($scope, $stateParams, $log, FeedData) {
    $log.info('Feed Detail Controller Created');
    $scope.feed = FeedData.getFeed($stateParams.feedId);

  });



  app.controller('ProfileCtrl', function ($scope, $cordovaSocialSharing) {
    
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share("Keep in touch with your organization by downloading the Ziviso app", "Ziviso App", "", "http://portal.ziviso.co.zw");
    };

  });


  app.controller('OrgsCtrl', function ($scope, $rootScope, $stateParams, $log, $http, $ionicLoading, OrgData, $ionicFilterBar) {
    $log.info('Orgs Controller Created');

    const token = localStorage.getItem('access_token');

    $ionicLoading.show({
               template: 'Loading...'
              });

    $http.get('http://ziviso.afri-teq.com/api/clients', 
        { 
          headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      }).success(function (data, headers, config) {
        OrgData.initData(data);
        $scope.orgs = OrgData.getOrgs();
        //get groups within client
        $scope.grps = OrgData.getOrg($stateParams.orgId);
        //get organization logo
        $rootScope.logo = $stateParams.orgLogo;
        //get organization email
        $rootScope.orgemail = $stateParams.orgEmail;
        //get organization phone
        $rootScope.orgphone = $stateParams.orgPhone;
        window.localStorage.setItem("orgs", JSON.stringify(data));
        $ionicLoading.hide();
        $log.info('data saved 1st org');
        $log.info($stateParams.orgLogo);

      })
      .error(function (data, headers, config) {
       // $log.info('error' + data);
        if(window.localStorage.getItem("orgs") !== undefined) {
          $scope.orgs = JSON.parse(window.localStorage.getItem("orgs"));
          $ionicLoading.hide();
        }

      });

      $scope.selectedAll = true;
      $scope.selectedMy = false;
      //show selected value from select dropdown
      $scope.showSelectValue = function(mySelect) {

        if(mySelect == "My Organizations"){

          $scope.selectedAll = false;
          $scope.selectedMy = true;

      }

      else {

          $scope.selectedAll = true;
          $scope.selectedMy = false;


      }

       console.log(mySelect);
     }

      $scope.showFilterBar = function () {
      var filterBarInstance = $ionicFilterBar.show({
        cancelText: "<i class='ion-ios-close-outline'></i>",
        items: $scope.feeds,
        update: function (filteredItems, filterText) {
          $scope.feeds = filteredItems;
        }
      });
    };

  });


  app.controller('OrgDetailCtrl', function ($scope, $ionicLoading, $stateParams, $http, $log, OrgData, $filter) {
    $log.info('Org Detail Controller Created');
    $scope.org = OrgData.getOrg($stateParams.orgId);

    $scope.id = $stateParams.orgId;
    $scope.name = $stateParams.orgName;
    $scope.description = $stateParams.orgDesc;

    $log.info($stateParams.orgId);

    // insert data into subscribers table when user clicks join org

      // var date = new Date();
      // var curdate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

      $scope.joinOrg = function(org_id){

        const token = localStorage.getItem('access_token');

        var link = 'http://ziviso.afri-teq.com/api/groups/'+org_id+'/join';

            $ionicLoading.show({
                   template: 'Please Wait...'
            });

            $http({
            url: link,
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token
            }
            }).then(function (data, status, headers, config){

              $ionicLoading.hide();
               alert('Your request is pending approval by the organisation');
               $log.info('organisation joined yay!');

            }, function (data, status, headers, config) {
            $ionicLoading.hide();
             $log.info('error: ' + data);
            });

        };
     

  });


  app.controller('CalendarCtrl', function ($scope, Events, $ionicFilterBar, $ionicLoading, $log, $http, $cordovaCalendar) {
    
    $ionicLoading.show({
               template: 'Loading...'
              });
   

    const token = localStorage.getItem('access_token');

    $http.get('http://ziviso.afri-teq.com/api/events', 
      { 
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      }).success(function (data, status, headers, config) {

        $ionicLoading.hide();

       // create an event function ////////////////////////////////
      $scope.createEvent = function() {
      //var obj = angular.toJson(data);
      
      $scope.event_info = data; 

      angular.forEach($scope.event_info, function(item){

        $cordovaCalendar.createEvent({
            title: item.event_title,
            location: item.event_address,
            notes: item.event_description,
            startDate: new Date(item.event_date),
            endDate: new Date(item.event_date)
        }).then(function (result) {
            console.log("Event created successfully");
            $ionicLoading.hide();

        }, function (err) {
            console.error("There was an error: " + err);
            $ionicLoading.hide();
        });

    });

    };
    /////////end function////////////////////////////////////////////


     // delete an event function ////////////////////////////////
      $scope.deleteEvent = function() {
      //var obj = angular.toJson(data);
      
      $scope.event_info = data; 

      angular.forEach($scope.event_info, function(item){

        $cordovaCalendar.deleteEvent({
            title: item.event_title,
            startDate: new Date(item.event_date),
            endDate: new Date(item.event_date)
        }).then(function (result) {
            console.log("Event removed");
            $ionicLoading.hide();

        }, function (err) {
            console.error("There was an error: " + err);
            $ionicLoading.hide();
        });

    });

    };
    /////////end function////////////////////////////////////////////
    
        Events.initData(data);
        $scope.events = Events.getEvents();


      }).
      error(function (data, headers, config) {
        $log.info('error' + data);

      })

    $scope.showFilterBar = function () {
      var filterBarInstance = $ionicFilterBar.show({
        cancelText: "<i class='ion-ios-close-outline'></i>",
        items: $scope.events,
        update: function (filteredItems, filterText) {
          $scope.events = filteredItems;
        }
      });
    };


  });


  app.controller('EventDetailCtrl', function ($scope, $stateParams, $log, Events) {
    $log.info('Org Detail Controller Created');
    $scope.event = Events.getEvent($stateParams.orgId);
  });


