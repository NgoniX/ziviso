angular.module('ziviso.controllers', []);


// Login Controller


app.controller('LoginCtrl', function($scope, $firebaseArray, CONFIG, $document, $localStorage, $cordovaOauth, $ionicLoading, $state) {


  // Perform Facebook Login/////////////////////////////////////////////////////////////////////////////////
  
var fb_app_id = '261875504226369';
  $scope.fblogin = function() {


 $cordovaOauth.facebook(fb_app_id, ["email"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $state.go("app.feed");
            console.log("Zvaita ");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });

      
      };


  //////////////////////////////////////////////////////////////////////////////////////////////////////////


  



  // Perform the login action when the user submits the login form
  $scope.doLogin = function(userLogin) {
    
    console.log(userLogin);

    if($document[0].getElementById("user_name").value != "" && $document[0].getElementById("user_pass").value != ""){

      $ionicLoading.show({
               template: 'Please Wait...'
              });

        firebase.auth().signInWithEmailAndPassword(userLogin.username, userLogin.password).then(function() {
          // Sign-In successful.
          //console.log("Login successful");


                    var user = firebase.auth().currentUser;

                    var name, email, photoUrl, uid;

                    if(user.emailVerified) { //check for verification email confirmed by user from the inbox

                      $ionicLoading.hide();

                      console.log("email verified");
                      $state.go("app.feed");

                      name = user.displayName;
                      email = user.email;
                      uid = user.uid;  

                      console.log(name + "<>" + email + "<>" +  photoUrl + "<>" +  uid);


                    }else{
                        $ionicLoading.hide();
                        alert("Email not verified, please check your inbox or spam messages");
                        return false;

                    } // end check verification email

           
        }, function(error) {
          // An error happened.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          if (errorCode === 'auth/invalid-email') {
             alert('Enter a valid email.');
             $ionicLoading.hide();
             return false;
          }else if (errorCode === 'auth/wrong-password') {
             alert('Incorrect password.');
             $ionicLoading.hide();
             return false;
          }else if (errorCode === 'auth/argument-error') {
             alert('Password must be string.');
             $ionicLoading.hide();
             return false;
          }else if (errorCode === 'auth/user-not-found') {
             alert('No such user found.');
             $ionicLoading.hide();
             return false;
          }else if (errorCode === 'auth/too-many-requests') {
             alert('Too many failed login attempts, please try after sometime.');
             $ionicLoading.hide();
             return false;
          }else if (errorCode === 'auth/network-request-failed') {
             alert('Request timed out, please try again.');
             $ionicLoading.hide();
             return false;
          }else {
             alert(errorMessage);
             $ionicLoading.hide();
             return false;

          }
        });



    }else{

        alert('Please enter email and password');
        return false;

    }//end check client username password

    
  };// end $scope.doLogin()

}); 


app.controller('AppCtrl', function($scope, $firebaseArray, CONFIG, $document, $state) {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        
      $document[0].getElementById("photo_user").src = localStorage.getItem("photo");
          
        
    } else {
      // No user is signed in.
      $state.go("login");
    }
  });


  $scope.doLogout = function(){
      
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        //console.log("Logout successful");
        $state.go("login");

      }, function(error) {
        // An error happened.
        console.log(error);
      });

};// end dologout()



});


app.controller('ResetCtrl', function($scope, $state, $document, $ionicLoading, $firebaseArray, CONFIG) {

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



app.controller('SignupCtrl', function($scope, $state, $document, $firebaseArray, $ionicLoading, CONFIG) {

$scope.doSignup = function(userSignup) {
    

   
    //console.log(userSignup);

    if($document[0].getElementById("cuser_name").value != "" && $document[0].getElementById("cuser_pass").value != ""){

     $ionicLoading.show({
               template: 'Loading...'
              });

        firebase.auth().createUserWithEmailAndPassword(userSignup.cusername, userSignup.cpassword).then(function() {
          // Sign-In successful.
          //console.log("Signup successful");

          var user = firebase.auth().currentUser;

          user.sendEmailVerification().then(function(result) { console.log(result) },function(error){ console.log(error)}); 

          user.updateProfile({
            displayName: userSignup.displayname,
            photoURL: userSignup.photoprofile
          }).then(function() {
            // Update successful.
            $ionicLoading.hide();
            $state.go("login");
          }, function(error) {
            // An error happened.
            console.log(error);
          });
          
          


        }, function(error) {
          // An error happened.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);

          if (errorCode === 'auth/weak-password') {
             alert('Password is weak, choose a strong password.');
             $ionicLoading.hide();
             return false;
          }else if (errorCode === 'auth/email-already-in-use') {
             alert('Email you entered is already in use.');
             $ionicLoading.hide();
             return false;
          }



          
        });



    }else{

        alert('Please enter email and password');
        return false;

    }//end check client username password

    
  };// end $scope.doSignup()
  
  
  
});






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
///

    app.controller('FeedCtrl', function ($scope, $log, $filter, $ionicLoading, $http, FeedData, $ionicFilterBar) {
      
    $log.info('Feed Controller Created');

    $ionicLoading.show({
               template: 'Loading...'
              });
    
    //get feed function
    $scope.getFeed = function(){

    $http.get('http://portal.ziviso.co.zw/feed', { params: { "api_key": "feedapi"}}).
      success(function (data, status, headers, config) {

        var feed_data = JSON.stringify(data);

         

        $log.info('getting data');
        FeedData.initData(data);
        $scope.feeds = FeedData.getFeeds();
        $ionicLoading.hide();
        window.localStorage.setItem("feeds", feed_data);

        ////////// For each ///////////////////////////////
        angular.forEach(data, function(item){
       // display user info
        var user = firebase.auth().currentUser;

        // check logged in user
        if (user !== null) {

        user.providerData.forEach(function (profile) {

        $scope.username = profile.displayName;
        $scope.id_feed = item.feed_id;

         // get firebase value
        return firebase.database().ref('/userInfo/' + $scope.username+'_'+$scope.id_feed).once('value').then(function(snapshot) {
        var feed_click = snapshot.val().clicked;
        var feedID = snapshot.val().feedID;

        var key = snapshot.key;

        //compare values//////////////////////////////////
       $scope.compareValues = function(IDFeed){

       if(IDFeed == feedID){

          return feedID;

        }

       };
       ////////// end compare ////////////////////////////

        $log.info(key +'<-->'+ feedID);

        });


      });

     }

     });
    ///////////////////  End for each  ////////////////////////

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

         // angular.forEach($scope.feeds, function(value, key){
         
         //  if(index == value.feed_id){

         //  $scope.feeds.splice($scope.feeds.indexOf(index), 1);
         //   console.log("Item: " + value.feed_id);

         //  }

         //  });

      
      // $scope.feeds.splice($scope.feeds.indexOf(index), 1);
      // console.log('item removed ' + index);
      // console.log('id of item ' + $scope.feedData);
    };

    // remove new badge icon /////////////////////////////////////////

    $scope.delBadge = function(feed_id){

        document.getElementById("newBadge_"+feed_id).style.display="none";
    };

    /////////////////////////////////////////////////////////////////


    //click list to update firebase db
    
    $scope.addData = function(feed_id){

      // display user info
    var user = firebase.auth().currentUser;


      if (user !== null) {

      user.providerData.forEach(function (profile) {

        $scope.name = profile.displayName;
        $scope.email = profile.email;
        $scope.id = profile.uid;

        console.log("Sign-in provider: "+profile.providerId);
        console.log("  Provider-specific UID: "+profile.uid);
        console.log("  Name: "+profile.displayName);
        console.log("  Email: "+profile.email);
      });
    
      // Set data in firebase
      firebase.database().ref('userInfo/' + $scope.name+'_'+feed_id).set({
      feedID: feed_id,
      clicked: "yes",
      userEmail: $scope.id
      });

      //get feed click data from user node
      return firebase.database().ref('/userInfo/' + $scope.name+'_'+feed_id).once('value').then(function(snapshot) {
      var feedClick = snapshot.val().clicked;
      var userEmail = snapshot.val().userEmail;
      var getfeedID = snapshot.val().feedID;

      
      //check if current user email = email in firebase db, feed paramter = feedID in firebase and clicked flag in firebase = yes
      if(userEmail === $scope.id && feed_id === getfeedID && feedClick === 'yes'){

        $scope.isClicked = feedClick;
        $scope.feedDBID = getfeedID;

        $scope.goaway = "Go Away";
        $log.info(feed_id +'<-->'+ getfeedID);
        
      }

      else{

        $scope.goaway = "Do not go";
        $log.info($scope.id_feed +'<-->'+ getfeedID);

      }

      });

     }

     

    };

    /////////////////////////////////////////////////////////////////////////////////////

    
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



  //   function allNotFound(filteredItems) {
  //   angular.forEach($scope.feeds, function(item){
  //     item.found = false;
  //   });
  // }
  
  // function matchingItems(filteredItems) {
  //   angular.forEach($scope.feeds, function(item){
  //       var found = $filter('filter')(filteredItems, {feed_title: item.feed_title});
  //       if (found && found.length > 0) {
  //           console.log('found', item.feed_title);
  //           item.found = true;

  //       } else {
  //         item.found = false;
  //         console.log('not found', item.feed_title);
  //       }
  //   });
  // }


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

    $ionicLoading.show({
               template: 'Loading...'
              });

    $http.get('http://portal.ziviso.co.zw/orgs', { params: {"api_key": "orgsfeed"}})
    .success(function (data, headers, config) {
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

    // display user info
    var user = firebase.auth().currentUser;

    var name, email, uid;

      name = user.displayName;
      email = user.email;
      uid = user.uid; 
      var date = new Date();
      var curdate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
 
    $scope.joinOrg = function(org_id){
        var link = 'http://portal.ziviso.co.zw/subscribers/joinOrg';
        
        var post_data = {
          username : name,
          email : email,
          curDate: curdate,
          orgID: org_id
        };

        $ionicLoading.show({
               template: 'Please Wait...'
              });

        $http.post(link, post_data, { 
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
        }).
        then(function (data, status, headers, config){

          $ionicLoading.hide();
           alert('You have joined this organization');
            $log.info('organisation joined yay!');
            $log.info('Username:'+name+ ' Email:'+email+' Date:'+curdate);

        }, function (data, status, headers, config) {
        $ionicLoading.hide();
         $log.info('error: ' + data);
         $log.info('Username:'+name+ ' Email:'+email+' Date:'+curdate+' orgID:'+org_id);
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
    /////////end fucntion////////////////////////////////////////////
    
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


