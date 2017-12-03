angular.module('ziviso.services', []);

  const baseURL = 'http://ziviso.afri-teq.com/';

  //create auth service
  app.factory('authService', function($http, $httpParamSerializerJQLike, $localStorage){

    var _user = localStorage.getItem('access_token');
    

    return {

      isLoggedIn: function () {
         return _user !== null ? true : false;
      },

      logout: function () {
         localStorage.removeItem('access_token');
         _user = null;
      },

      userInfo: function (){

        return $http({

          method: 'GET',
          url: baseURL + 'api/user',
          headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + _user
          }
        })

      },

      signup: function(name, email, phone, profile, username, password, password_confirmation, country){
        return $http({
        method: 'POST',
        url: baseURL + 'api/register',
        data: $httpParamSerializerJQLike({
                    name: name,
                    email: email,
                    phone: phone,
                    profile: profile,
                    username: username,
                    password: password,
                    password_confirmation: password_confirmation,
                    country: country
                    }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });

      },

      resetPass: function(current_password, password, password_confirmation){
        return $http({
        method: 'POST',
        url: baseURL + 'api/update-password',
        data: $httpParamSerializerJQLike({
                    current_password: current_password,
                    password: password,
                    password_confirmation: password_confirmation
                    }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + _user
          }
      });

      },

      login: function(username, password){
        return $http({
        method: 'POST',
        url: baseURL + 'oauth/token',
        data: $httpParamSerializerJQLike({
                    grant_type:"password",
                    username: username,
                    password: password,
                    client_id:2,
                    client_secret:"nQhD2uRVphdqgbNVSXqLiC8A3vzxV8qgkhikZLO8",
                    scope:"*"
                    }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });

      } //end login
      
    };

  })


    app.factory('FeedData', function ($log) {
    var theFeedData = [];

    return {
      initData: function (theData) {
        theFeedData = theData;
        return null;
      },
      getFeeds: function () {
        return theFeedData;
      },
      getFeed: function (feedID) {
        for (var i = 0; i < theFeedData.length; i++) {

          if (theFeedData[i].id == parseInt(feedID)) {
            return theFeedData[i];

          }
        }
        return null;
      }
    }

  })

  app.factory('FeedCache', function ($cacheFactory) {
    return $cacheFactory('theFeedData');
  })

  app.factory('OrgData', function ($log) {
    $log.info('OrgData Created');
    var theOrgData = [];

    return {
      initData: function (theData) {
        theOrgData = theData;
        return null;
      },
      getOrgs: function () {
        return theOrgData;
      },
      getOrg: function (orgID) {
        for (var i = 0; i < theOrgData.length; i++) {
          if (theOrgData[i].id == parseInt(orgID)) {
            $log.info(theOrgData[i]);
            return theOrgData[i];

          }
        }
        return null;

      }
    };
  })

  app.factory('Events', function ($q) {
    var theEventData = [];

    return {
      initData: function (theData) {
        theEventData = theData;
        return null;
      },
      getEvents: function () {
        return theEventData;
      },
      getEvent: function (eventID) {
        for (var i = 0; i < theEventData.length; i++) {
          if (theEventData[i].id == parseInt(eventID)) {
            $log.info(theEventData[i]);
            return theEventData[i];

          }
        }
        return null;

      }
    };


  })
