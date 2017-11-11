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

 

      // $cordovaBadge.hasPermission().then(function(result) {
      //           $cordovaBadge.set(4);
      //           console.log('You have permission, boy');
      //       }, function(error) {
      //           console.log(error);
      //       });
      //////////////////////////////////

        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }  



  // Check if user is already logged in
//   firebase.auth().onAuthStateChanged(function(user) {

//     if (user) {
//         $state.go('app.feed');
//         console.log('user uid: ' + user.uid);
//     }
// });

     // Enable to debug issues.
  // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("5de14675-9994-4c0d-83f4-13b6f7672cec", "21146007526")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();
    
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
      // org.apache.cordova.statusbar required
      StatusBar.overlaysWebView( true );
      StatusBar.backgroundColorByHexString('#0288D1');
      StatusBar.styleLightContent();
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

  .state('app.organization-detail', {
    url: '/organization/:orgId',
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
