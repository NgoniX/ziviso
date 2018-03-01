// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


var app = angular.module('ziviso', [
  'ionic', 'ziviso.controllers', 'ngStorage', 'ngMessages', 'ziviso.services', 'ziviso.filters', 'ngCordova', 'jett.ionic.filter.bar', 'ngCordovaOauth'
  ]);


app.run(function($ionicPlatform, $state, $rootScope, $cordovaBadge, $ionicPopup, authService) {
   
  $ionicPlatform.ready(function() {

  

  //    $cordovaBadge.clear().then(function() {
  //   // You have permission, badge cleared.
  // }, function(err) {
  //   // You do not have permission.
  // });

  //check if user is already logged in
  var currentUser = authService.isLoggedIn();
      $rootScope.isLoggedIn = false;

      if (currentUser) {
          $state.go('app.feed');
          $rootScope.isLoggedIn = true;
      } else {
          $state.go('login');
      } 
    //end function

  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("0d513e82-207f-4c38-869f-b287b380af05")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();

     // Check for network connection
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
          title: 'Network Problem',
          content: 'Sorry, Please Check Your Network Connection.'
        })
        .then(function(result) {
          if(!result) {
            navigator.app.exitApp();
          }
        });
      }
    }

        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            //FCMPlugin.getToken( successCallback(token), errorCallback(err) );
//Keep in mind the function will return null if the token has not been established yet.
            FCMPlugin.getToken(
                function (token) {
                    //alert('Token: ' + token);
                    console.log('Token: ' + token);
                    localStorage.setItem("device_token", token);
                },
                function (err) {
                    //alert('error retrieving token: ' + token);
                    console.log('error retrieving token: ' + err);
                }
            );

            FCMPlugin.onNotification(
                function(data){

                    if(data.wasTapped){
            //Notification was received on device tray and tapped by the user.

                      alert("Tapped: " +  JSON.stringify(data) );

                    }else{
            //Notification was received in foreground. Maybe the user needs to be notified.
                        console.log("Not tapped: " + JSON.stringify(data) );
                    
                        
                    }
                },
                function(msg){
                    //alert('onNotification callback successfully registered: ' + msg);
                    console.log('onNotification callback successfully registered: ' + msg);
                },
                function(err){
                   // alert('Error registering onNotification callback: ' + err);
                    console.log('Error registering onNotification callback: ' + err);
                }
            );



        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }  

  
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

    
  // Sync hashed email if you have a login system or collect it.
  //   Will be used to reach the user at the most optimal time of day.
  // window.plugins.OneSignal.syncHashedEmail(userEmail);
     // Hide splash screen
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 100);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.hide();
      // org.apache.cordova.statusbar required
      // StatusBar.overlaysWebView( true );
      // StatusBar.backgroundColorByHexString('#0288D1');
      // StatusBar.styleLightContent();
      //StatusBar.styleDefault();
    }
  });
});


 app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.scrolling.jsScrolling('true');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider


    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })


  // State to represent Login View
.state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
})

.state('signup', {
      url: '/signup',
      templateUrl: "templates/signup.html",
      controller: "SignupCtrl"
    })

.state('reset', {
      url: '/reset',
      templateUrl: "templates/resetemail.html",
      controller: "ResetCtrl"
    })

  .state('app.feed', {
    url: '/feed',
    views: {
      'menuContent': {
        templateUrl: 'templates/feed.html',
        controller: 'FeedCtrl'
      }
    }
  })

  .state('app.feed-detail', {
      url: '/feed/:feedId',
      views: {
        'menuContent': {
          templateUrl: 'templates/feed-detail.html',
          controller: 'FeedDetailCtrl'
        }
      }
    })
    .state('app.organizations', {
      url: '/organizations',
      views: {
        'menuContent': {
          templateUrl: 'templates/organizations.html',
          controller: 'OrgsCtrl'
        }
      }
    })

    .state('app.organization-desc', {
    url: '/organization/:orgId?orgLogo?orgEmail?orgPhone?orgName?orgDesc',
    views: {
      'menuContent': {
        templateUrl: 'templates/organization-desc.html',
        controller: 'OrgDetailCtrl'
      }
    }
  })

    .state('app.organization-groups', {
      url: '/organization/:orgId?orgLogo?orgEmail?orgPhone',
      views: {
        'menuContent': {
          templateUrl: 'templates/organization-groups.html',
          controller: 'OrgsCtrl'
        }
      }
    })

  .state('app.organization-detail', {
    url: '/organization/:orgId?orgName?orgDesc',
    views: {
      'menuContent': {
        templateUrl: 'templates/organization-detail.html',
        controller: 'OrgDetailCtrl'
      }
    }
  })



   .state('app.calendar', {
        url: '/calendar',
        views: {
          'menuContent': {
            templateUrl: 'templates/calendar.html',
            controller: 'CalendarCtrl'
          }
        }
      })

  .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      });
  // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go("login");
        });
});
