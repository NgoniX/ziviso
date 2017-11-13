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


app.controller('AppCtrl', function($scope, authService, $localStorage, $document, $state, $ionicPopup) {

  // get user info
  authService.userInfo().then((data) => {

         $scope.information = data;

         $scope.name = $scope.information.data.name;
         $scope.email = $scope.information.data.email;

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


app.controller('ResetCtrl', function($scope, $state, $document, $ionicLoading, $firebaseArray) {

$scope.doResetemail = function(userReset) {
    

   
    //console.log(userReset);

    if($document[0].getElementById("ruser_name").value != ""){

       $ionicLoading.show({
               template: 'Loading...'
              });

        firebase.auth().sendPasswordResetEmail(userReset.rusername).then(function() {
          // Sign-In successful.
          //console.log("Reset email sent successful");
          
          $state.go("login");
          alert('Email has been sent. Please check your inbox');
          $ionicLoading.hide();

        }, function(error) {
          // An error happened.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);

          
          if (errorCode === 'auth/user-not-found') {
             alert('No user found with provided email.');
             $ionicLoading.hide();
             return false;
          }else if (errorCode === 'auth/invalid-email') {
             alert('Email you entered is not complete or invalid.');
             $ionicLoading.hide();
             return false;
          }
          
        });



    }else{

        alert('Please enter registered email to send reset link');
        return false;

    }//end check client username password

    
  };// end $scope.doSignup()
  
  
  
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


    //remove list item from localstorage
    $scope.delItem = function(index){

        $scope.feeds.splice(index, 1);

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



  app.controller('ProfileCtrl', function ($scope, $firebaseArray, CONFIG, $cordovaSocialSharing) {

// display user info
    var user = firebase.auth().currentUser;

if (user !== null) {
  user.providerData.forEach(function (profile) {

    $scope.name = profile.displayName;
    $scope.email = profile.email;

    console.log("Sign-in provider: "+profile.providerId);
    console.log("  Provider-specific UID: "+profile.uid);
    console.log("  Name: "+profile.displayName);
    console.log("  Email: "+profile.email);
    console.log("  Photo URL: "+profile.photoURL);
  });
}
    
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share("Keep in touch with your organization by downloading the Ziviso app", "Ziviso App", "", "http://portal.ziviso.co.zw");
    };

  });


  app.controller('OrgsCtrl', function ($scope, $log, $http, $ionicLoading, OrgData, $ionicFilterBar) {
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
        window.localStorage.setItem("orgs", JSON.stringify(data));
        $ionicLoading.hide();
        $log.info('data saved');

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

    // insert data into subscribers table when user clicks join org

      // var date = new Date();
      // var curdate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

      $scope.joinOrg = function(org_id){

        const token = localStorage.getItem('access_token');

        var link = 'http://ziviso.afri-teq.com/api/groups/'+org_id+'/join';

            $ionicLoading.show({
                   template: 'Please Wait...'
            });

            $http.post(link, { 

             headers: { Authorization: 'Bearer ' + token }

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
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {

    //})
    $ionicLoading.show({
               template: 'Loading...'
              });
   

    $http.get('http://portal.ziviso.co.zw/events-api').
      success(function (data, headers, config) {

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


