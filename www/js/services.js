angular.module('ziviso.services', ['firebase']);



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

          if (theFeedData[i].feed_id == parseInt(feedID)) {
            return theFeedData[i];

          }
        }
        return null;
      }
    }

  })

  app.factory('FeedCache', function ($cacheFactory) {
    return $cacheFactory('theFeedData')
  })

  .factory('OrgData', function ($log) {
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
          if (theOrgData[i].org_id == parseInt(orgID)) {
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
          if (theEventData[i].event_id == parseInt(eventID)) {
            $log.info(theEventData[i]);
            return theEventData[i];

          }
        }
        return null;

      }
    };


  })
