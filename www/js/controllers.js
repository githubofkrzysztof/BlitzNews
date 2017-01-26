angular.module('starter.controllers', ['ionic', 'ngCordova', 'ngStorage'])

.service('dataService', function($http){
    delete $http.defaults.headers.common['X-Requested-With'];
    var current_year = new Date().getFullYear();
    var end_year = current_year;
    if (new Date().getMonth()+1<9){
      current_year = current_year -1;
    }
    this.getData = function(){
      return $http({
        method : 'GET',
        url : 'https://www.mysportsfeeds.com/api/feed/pull/nfl/'+current_year+'-'+end_year+'-regular/division_team_standings.json',
        headers : {'Authorization': 'Basic ZGFyaW5nYXBwc2xsYzoyMUJyYXZvMzZaZXRh'}
      });
    }
})

.service('dataService1', function($http){
    delete $http.defaults.headers.common['X-Requested-With'];
    var current_year = new Date().getFullYear();
    var end_year = current_year;
    if (new Date().getMonth()+1<9){
      current_year = current_year -1;
    }
    this.getData = function(date){
      return $http({
        method : 'GET',
        url : 'https://www.mysportsfeeds.com/api/feed/pull/nfl/'+current_year+'-'+end_year+'-regular/scoreboard.json?fordate='+date,
        //url : 'https://www.mysportsfeeds.com/api/feed/pull/nfl/'+current_year+'-'+end_year+'-regular/scoreboard.json?fordate=20170101',
        headers : {'Authorization': 'Basic ZGFyaW5nYXBwc2xsYzoyMUJyYXZvMzZaZXRh'}
      });
    }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

.controller('PlaylistsCtrl', function($scope, $state) {
 
})

.controller('StandingsCtrl', function($scope, $http, dataService, $timeout, 
     $state, $stateParams, $ionicPlatform, $ionicPopup) {
    $scope.standingData = null;
    $scope.showLoadingFlag = true;
    dataService.getData().then(function(dataResponse){
      $scope.showLoadingFlag = false;
      $scope.standingData = dataResponse.data.divisionteamstandings.division;
      for (var k=0; k<$scope.standingData.length; k++){
          var temp_str = $scope.standingData[k]['@name'];
          $scope.standingData[k]['@name'] = temp_str.substring(4);
      }
      console.log($scope.standingData);
      
    });

    $scope.refresh = function(){
        $scope.standingData = null;
        $scope.showLoadingFlag = true;
        dataService.getData().then(function(dataResponse){
            $scope.showLoadingFlag = false;
            $scope.standingData = dataResponse.data.divisionteamstandings.division;
            console.log($scope.standingData);
        });
    }
})

.controller('NewsCtrl', function($scope, $ionicActionSheet, $timeout, $rootScope, TwitterREST, $localStorage, $state, $stateParams, $ionicPlatform, $ionicPopup) {
  $rootScope.urlList = [];
  var tbl_siteUrl = Parse.Object.extend("siteURL");
  var query = new Parse.Query(tbl_siteUrl);
  query.ascending("order");
  query.find({
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        $rootScope.urlList.push(results[i].get('url'));
      }
      console.log($rootScope.urlList);

      var admobid = {};
      if( /(android)/i.test(navigator.userAgent) ) {
        admobid = {
          banner: 'ca-app-pub-1099116351739935/7329808809',
          interstitial: 'ca-app-pub-1099116351739935/7329808809'
        };
      } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        admobid = {
          banner: 'ca-app-pub-1099116351739935/1422876001',
          interstitial: 'ca-app-pub-1099116351739935/1422876001'
        };
      } else {
        admobid = {
          banner: 'ca-app-pub-xxx/zzz',
          interstitial: 'ca-app-pub-xxx/kkk'
        };
      }

      if(AdMob) 
        AdMob.createBanner({
          adId: admobid.banner,
          position: AdMob.AD_POSITION.BOTTOM_CENTER,
          autoShow: true 
        });

    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
  $scope.alert_flag = false;
  
  if ($localStorage['newslists'] == undefined){
      $rootScope.playlists = [
          { title: 'ESPN', id: 1, checked: true, twitter_flag:false},
          { title: 'ESPN - Twitter', id: 2, checked: true, twitter_flag:true},

          { title: 'CBS Sports', id: 3, checked: true, twitter_flag:false  },

          { title: 'Yahoo Sports', id: 4, checked: true , twitter_flag:false },
          
          { title: 'NBC Pro Football Talk', id: 5, checked: true , twitter_flag:false },
          
          { title: 'Bleacher Report', id: 6 , checked: true, twitter_flag:false },
          
          { title: 'Sports Illustrated', id: 7 , checked: true, twitter_flag:false },
          
          { title: 'NFL', id: 8 , checked: true, twitter_flag:false },
          { title: 'NFL - Twitter', id: 9 , checked: true, twitter_flag:true},
          
          { title: 'Fox Sports', id: 10 , checked: true, twitter_flag:false },
          { title: 'Fox Sports NFL - Twitter', id: 11 , checked: true, twitter_flag:true},
          
           { title: 'NBC Sports', id: 12, checked: false , twitter_flag:false },
          
          { title: 'SBNation', id: 13 , checked: true, twitter_flag:false },
          
          { title: 'Arizona Cardinals', id: 14 , checked: true, twitter_flag:false },
          { title: 'Arizona Cardinals - Twitter', id: 15 , checked: true, twitter_flag:true},
          
          { title: 'Atlanta Falcons', id: 16 , checked: true, twitter_flag:false },
          { title: 'Atlanta Falcons - Twitter', id: 17 , checked: true, twitter_flag:true},
          
          { title: 'Baltimore Ravens', id: 18 , checked: true, twitter_flag:false },
          { title: 'Baltimore Ravens - Twitter', id: 19 , checked: true, twitter_flag:true},
          
          { title: 'Buffalo Bills', id: 20 , checked: true, twitter_flag:false },
          { title: 'Buffalo Bills - Twitter', id: 21 , checked: true, twitter_flag:true},
          
          { title: 'Carolina Panthers', id: 22 , checked: true, twitter_flag:false },
          { title: 'Carolina Panthers - Twitter', id: 23 , checked: true, twitter_flag:true},
          
          { title: 'Chicago Bears', id: 24 , checked: true, twitter_flag:false },
          { title: 'Chicago Bears - Twitter', id: 25, checked: true , twitter_flag:true},
          
          { title: 'Cincinnati Bengals', id: 26 , checked: true, twitter_flag:false },
          { title: 'Cincinnati Bengals - Twitter', id: 27 , checked: true, twitter_flag:true},
          
          { title: 'Cleveland Browns', id: 28 , checked: true, twitter_flag:false },
          { title: 'Cleveland Browns - Twitter', id: 29 , checked: true, twitter_flag:true},
          
          { title: 'Dallas Cowboys', id: 30 , checked: true, twitter_flag:false },
          { title: 'Dallas Cowboys - Twitter', id: 31 , checked: true, twitter_flag:true},

          { title: 'Denver Broncos', id: 32 , checked: true, twitter_flag:false },
          { title: 'Denver Broncos - Twitter', id: 33 , checked: true, twitter_flag:true},

          { title: 'Detroit Lions', id: 34 , checked: true, twitter_flag:false },
          { title: 'Detroit Lions - Twitter', id: 35, checked: true, twitter_flag:true},

          { title: 'Green Bay Packers', id: 36 , checked: true, twitter_flag:false },
          { title: 'Green Bay Packers - Twitter', id: 37 , checked: true, twitter_flag:true},

          { title: 'Houston Texans', id: 38 , checked: true, twitter_flag:false },
          { title: 'Houston Texans - Twitter', id: 39 , checked: true, twitter_flag:true},
          
          { title: 'Indianapolis Colts', id: 40 , checked: true, twitter_flag:false },
          { title: 'Indianapolis Colts - Twitter', id: 41 , checked: true, twitter_flag:true},

          { title: 'Jacksonville Jaguars', id: 42 , checked: true, twitter_flag:false },
          { title: 'Jacksonville Jaguars - Twitter', id: 43 , checked: true, twitter_flag:true},

          { title: 'Kansas City Chiefs', id: 44 , checked: true, twitter_flag:false },
          { title: 'Kansas City Chiefs - Twitter', id: 45 , checked: true, twitter_flag:true},

          { title: 'Los Angeles Chargers', id: 46 , checked: true, twitter_flag:false },
          { title: 'Los Angeles Chargers - Twitter', id: 47 , checked: true, twitter_flag:true},
          
          { title: 'Los Angeles Rams', id: 48 , checked: true, twitter_flag:false },
          { title: 'Los Angeles Rams - Twitter', id: 49 , checked: true, twitter_flag:true},

          { title: 'Miami Dolphins', id: 50 , checked: true, twitter_flag:false },
          { title: 'Miami Dolphins - Twitter', id: 51 , checked: true, twitter_flag:true},
          
          { title: 'Minnesota Vikings', id: 52 , checked: true, twitter_flag:false },
          { title: 'Minnesota Vikings - Twitter', id: 53 , checked: true, twitter_flag:true},

          { title: 'New England Patriots', id: 54 , checked: true, twitter_flag:false },
          { title: 'New England Patriots - Twitter', id: 55 , checked: true, twitter_flag:true},

          { title: 'New Orleans Saints', id: 56 , checked: true, twitter_flag:false },
          { title: 'New Orleans Saints - Twitter', id: 57 , checked: true, twitter_flag:true},

          { title: 'New York Giants', id: 58 , checked: true, twitter_flag:false },
          { title: 'New York Giants - Twitter', id: 59 , checked: true, twitter_flag:true},

          { title: 'New York Jets', id: 60 , checked: true, twitter_flag:false },
          { title: 'New York Jets - Twitter', id: 61 , checked: true, twitter_flag:true},

          { title: 'Oakland Raiders', id: 62 , checked: true, twitter_flag:false },
          { title: 'Oakland Raiders - Twitter', id: 63 , checked: true, twitter_flag:true},
          
          { title: 'Philadelphia Eagles', id: 64 , checked: true, twitter_flag:false },
          { title: 'Philadelphia Eagles - Twitter', id: 65 , checked: true, twitter_flag:true},
          
          { title: 'Pittsburgh Steelers', id: 66 , checked: true, twitter_flag:false },
          { title: 'Pittsburgh Steelers - Twitter', id: 67 , checked: true, twitter_flag:true},

          { title: 'San Francisco 49ers', id: 68 , checked: true, twitter_flag:false },
          { title: 'San Francisco 49ers - Twitter', id: 69 , checked: true, twitter_flag:true},

          { title: 'Seattle Seahawks', id: 70 , checked: true, twitter_flag:false },
          { title: 'Seattle Seahawks - Twitter', id: 71 , checked: true, twitter_flag:true},

          { title: 'Tampa Bay Buccaneers', id: 72 , checked: true, twitter_flag:false },
          { title: 'Tampa Bay Buccaneers - Twitter', id: 73 , checked: true, twitter_flag:true},

          { title: 'Tennessee Titans', id: 74 , checked: true, twitter_flag:false },
          { title: 'Tennessee Titans - Twitter', id: 75 , checked: true, twitter_flag:true},

          { title: 'Washington Redskins', id: 76 , checked: true, twitter_flag:false },
          { title: 'Washington Redskins - Twitter', id: 77 , checked: true, twitter_flag:true }
        ];

    $localStorage['newslists'] = $rootScope.playlists;
  }
  else{
    $rootScope.playlists = $localStorage['newslists'];
  }
  
  $scope.moreOptions = function(){
    $scope.alert_flag = true;
    var hideSheet=$ionicActionSheet.show({
      buttons: [
        {text: '<b>Manage Feeds</b>'}
      ],
      titleText: 'More Options',
      cancelText: 'Cancel',
      cancel: function(){
        hideSheet();
      },
      buttonClicked:function(index){
        window.location.href="#/app/manage-feeds";
        return true;
      }
    });
  };
})

.controller('NewsSourceCtrl', function($scope, $stateParams, $ionicActionSheet, 
                  $ionicScrollDelegate, $timeout, $rootScope, $http, $cordovaInAppBrowser, TwitterREST) {
  
  $scope.showLoadingFlag = true;
  $timeout(function(){
    $scope.showLoadingFlag = false;
  }, 2000);
  $scope.alert_flag = false;
  $scope.title = $rootScope.playlists[$stateParams.playlistId].title;
  $rootScope.feed_type = 0;

  $scope.getTwitterFeed = function (url){
    $rootScope.posts=[];
    $rootScope.images=[];
    TwitterREST.sync(url).then(function(tweets){
          console.log(tweets);
          $scope.tweets = tweets.statuses;
          $rootScope.feed_type = 1;
          $rootScope.posts = $scope.tweets;

          $rootScope.feedURL = $rootScope.urlList[$stateParams.playlistId];
          
          for (var j=0;j<$rootScope.posts.length;j++){
            if ($rootScope.posts[j].extended_entities != undefined){
              console.log($rootScope.posts[j].extended_entities.media[0].media_url);
              $rootScope.images.push($rootScope.posts[j].extended_entities.media[0].media_url);
            }
            else if ($stateParams.playlistId == 1){
              $rootScope.images.push("img/sources/2.png");

            }
            else if ($stateParams.playlistId == 8){
              $rootScope.images.push("img/sources/9.png");
            }
            else if ($stateParams.playlistId == 10){
              $rootScope.images.push("img/sources/11.png");
            }
            else if ($stateParams.playlistId == 14){
                $rootScope.images.push("img/sources/15.png");
            }
            else if ($stateParams.playlistId == 16){
                $rootScope.images.push("img/sources/17.png");
            }
            else if ($stateParams.playlistId == 18){
                $rootScope.images.push("img/sources/19.png");
            }
            else if ($stateParams.playlistId == 20){
                $rootScope.images.push("img/sources/21.png");
            }
            else if ($stateParams.playlistId == 22){
                $rootScope.images.push("img/sources/23.png");
            }
            else if ($stateParams.playlistId == 24){
                $rootScope.images.push("img/sources/25.png");
            }
            else if ($stateParams.playlistId == 26){
                $rootScope.images.push("img/sources/27.png");
            }
            else if ($stateParams.playlistId == 28){
                $rootScope.images.push("img/sources/29.png");
            }
            else if ($stateParams.playlistId == 30){
                $rootScope.images.push("img/sources/31.png");
            }
            else if ($stateParams.playlistId == 32){
                $rootScope.images.push("img/sources/33.png");
            }
            else if ($stateParams.playlistId == 34){
                $rootScope.images.push("img/sources/35.png");
            }
            else if ($stateParams.playlistId == 36){
                $rootScope.images.push("img/sources/37.png");
            }
            else if ($stateParams.playlistId == 38){
                $rootScope.images.push("img/sources/39.png");
            }
            else if ($stateParams.playlistId == 40){
                $rootScope.images.push("img/sources/41.png");
            }
            else if ($stateParams.playlistId == 42){
                $rootScope.images.push("img/sources/43.png");
            }
            else if ($stateParams.playlistId == 44){
                $rootScope.images.push("img/sources/45.png");
            }
            else if ($stateParams.playlistId == 46){
                $rootScope.images.push("img/sources/47.png");
            }
            else if ($stateParams.playlistId == 48){
                $rootScope.images.push("img/sources/49.png");
            }
            else if ($stateParams.playlistId == 50){
                $rootScope.images.push("img/sources/51.png");
            }
            else if ($stateParams.playlistId == 52){
                $rootScope.images.push("img/sources/53.png");
            }
            else if ($stateParams.playlistId == 54){
                $rootScope.images.push("img/sources/55.png");
            }
            else if ($stateParams.playlistId == 56){
                $rootScope.images.push("img/sources/57.png");
            }
            else if ($stateParams.playlistId == 58){
                $rootScope.images.push("img/sources/59.png");
            }
            else if ($stateParams.playlistId == 60){
                $rootScope.images.push("img/sources/61.png");
            }
            else if ($stateParams.playlistId == 62){
                $rootScope.images.push("img/sources/63.png");
            }
            else if ($stateParams.playlistId == 64){
                $rootScope.images.push("img/sources/65.png");
            }
            else if ($stateParams.playlistId == 66){
                $rootScope.images.push("img/sources/67.png");
            }
            else if ($stateParams.playlistId == 68){
                $rootScope.images.push("img/sources/69.png");
            }
            else if ($stateParams.playlistId == 70){
                $rootScope.images.push("img/sources/71.png");
            }
            else if ($stateParams.playlistId == 72){
                $rootScope.images.push("img/sources/73.png");
            }
            else if ($stateParams.playlistId == 74){
                $rootScope.images.push("img/sources/75.png");
            }
            else if ($stateParams.playlistId == 76){
                $rootScope.images.push("img/sources/77.png");
            }
          }

          for (var i = 0; i<$rootScope.posts.length; i++){
              var d1=new Date();
              var d2=new Date($rootScope.posts[i].created_at);
              var diff = new Date(d1.getTime() - d2.getTime());
              var days = diff.getUTCDate()-1;
              var hours = diff.getUTCHours();
              var mins = diff.getUTCMinutes();

              if (days > 0){
                  $rootScope.posts[i].created_at = days + "d ago";
              }
              else if (hours > 0){
                  $rootScope.posts[i].created_at = hours + "h ago";
              }
              else if (mins > 0){
                  $rootScope.posts[i].created_at = mins + "m ago";
              }
              else {
                  $rootScope.posts[i].created_at = "Just posted";
              }
          }
      });
  }

  $scope.getRssFeed = function (url){
    $rootScope.feed_type = 0;
    
    $rootScope.posts=[];
    $rootScope.images=[];
    var google_converter="http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=";
    //var google_converter1="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20'";
    //var google_converter2="'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK";
    console.log(encodeURIComponent(url));
    //var request = $http.jsonp(google_converter + encodeURIComponent(url));
    var request = $http.jsonp("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20'" 
      + encodeURIComponent(url) + "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK");
    request.success(function(res){
      console.log(res);
      //var insteadposts = res.responseData.feed.entries;
      var insteadposts;
      if ($stateParams.playlistId != 12 && $stateParams.playlistId != 7){
        insteadposts = res.query.results.rss.channel.item;
      }
      else{
        $rootScope.feed_type = 2;
        insteadposts = res.query.results.feed.entry;
      }
      for(var ii=0; ii<insteadposts.length; ii++){


          if ($stateParams.playlistId == 4 || $stateParams.playlistId >= 10 || $stateParams.playlistId == 7 || insteadposts[ii].description.includes("nfl") || insteadposts[ii].link.includes("nfl") || insteadposts[ii].title.includes("nfl") 
              || $stateParams.playlistId==3 || $stateParams.playlistId==8){
              $rootScope.posts.push(insteadposts[ii]);
              if ($stateParams.playlistId == 0){
                  $rootScope.images.push("img/sources/1.png");
              }
              else if ($stateParams.playlistId == 2){
                  $rootScope.images.push("img/sources/3.png");
              }
              else if($stateParams.playlistId ==3){

                  if (insteadposts[ii].content != null){
                    console.log(insteadposts[ii].content.url);
                    $rootScope.images.push(insteadposts[ii].content.url);
                  }
                  else{
                    $rootScope.images.push("img/sources/4.png");
                  }
              }
              else if($stateParams.playlistId == 4){
                  // if (insteadposts[ii].mediaGroups != null){
                  //   console.log(insteadposts[ii].mediaGroups[0].contents[0].url);
                  //   $rootScope.images.push(insteadposts[ii].mediaGroups[0].contents[0].url);
                  // }
                  // else{
                  //   $rootScope.images.push("img/sources/5.png");
                  // }

                  if (insteadposts[ii].content != null){
                    console.log(insteadposts[ii].content[0].url);
                    $rootScope.images.push(insteadposts[ii].content[0].url);
                  }
                  else{
                    $rootScope.images.push("img/sources/5.png");
                  }
              }
              else if ($stateParams.playlistId == 5){
                  $rootScope.images.push('img/sources/6.png');
              }
              else if ($stateParams.playlistId == 6){
                if (insteadposts[ii].content != null){
                    console.log(insteadposts[ii].content.url);
                    $rootScope.images.push(insteadposts[ii].content.url);
                  }
                  else{
                    $rootScope.images.push("img/sources/7.png");
                  }
              }
              else if ($stateParams.playlistId == 7){
                  $rootScope.images.push("img/sources/8.png");
              }
              else if($stateParams.playlistId == 9){
                  $rootScope.images.push("img/sources/10.png");
              }
              else if ($stateParams.playlistId == 11){
                  if (insteadposts[ii].content != null){
                    console.log(insteadposts[ii].content[0].url);
                    $rootScope.images.push(insteadposts[ii].content[0].url);
                  }
                  else{
                    $rootScope.images.push("img/sources/12.png");
                  }
              }
              else if ($stateParams.playlistId == 12){
                  
                  var end_position = insteadposts[ii].content.content.indexOf(">");
                  var image_str = insteadposts[ii].content.content.substring(22, end_position-3);
                  console.log(image_str);
                  if (image_str != null){
                    $rootScope.images.push(image_str);
                  }
                  else{
                    $rootScope.images.push("/img/sources/13.png");
                  }
              }
              else if ($stateParams.playlistId == 13){
                  $rootScope.images.push("img/sources/14.png");
              }
              else if ($stateParams.playlistId == 15){
                  $rootScope.images.push("img/sources/16.png");
              }
              else if ($stateParams.playlistId == 17){
                  $rootScope.images.push("img/sources/18.png");
              }
              else if ($stateParams.playlistId == 19){
                  $rootScope.images.push("img/sources/20.png");
              }
              else if ($stateParams.playlistId == 21){
                  $rootScope.images.push("img/sources/22.png");
              }
              else if ($stateParams.playlistId == 23){
                  $rootScope.images.push("img/sources/24.png");
              }
              else if ($stateParams.playlistId == 25){
                  $rootScope.images.push("img/sources/26.png");
              }
              else if ($stateParams.playlistId == 27){
                  $rootScope.images.push("img/sources/28.png");
              }
              else if($stateParams.playlistId == 29){
                  if (insteadposts[ii].content != null){
                    console.log(insteadposts[ii].content.url);
                    $rootScope.images.push(insteadposts[ii].content.url);
                  }
                  else{
                    $rootScope.images.push("img/sources/30.png");
                  }
              }
              else if($stateParams.playlistId == 31){
                  $rootScope.images.push("img/sources/32.png");
              }
              else if ($stateParams.playlistId == 33){
                  $rootScope.images.push("img/sources/34.png");
              }
              else if ($stateParams.playlistId == 35){
                  $rootScope.images.push("img/sources/36.png");
              }
              else if ($stateParams.playlistId == 37){
                  $rootScope.images.push("img/sources/38.png");
              }
              else if ($stateParams.playlistId == 39){
                  $rootScope.images.push("img/sources/40.png");
              }
              else if ($stateParams.playlistId == 41){
                  $rootScope.images.push("img/sources/42.png");
              }
              else if ($stateParams.playlistId == 43){
                  $rootScope.images.push("img/sources/44.png");
              }
              else if ($stateParams.playlistId == 45){
                  $rootScope.images.push("img/sources/46.png");
              }
              else if ($stateParams.playlistId == 47){
                  $rootScope.images.push("img/sources/48.png");
              }
              else if ($stateParams.playlistId == 49){
                  $rootScope.images.push("img/sources/50.png");
              }
              else if ($stateParams.playlistId == 51){
                  if (insteadposts[ii].content != null){
                    console.log(insteadposts[ii].content.url);
                    $rootScope.images.push(insteadposts[ii].content.url);
                  }
                  else{
                    $rootScope.images.push("img/sources/52.png");
                  }
              }
              else if ($stateParams.playlistId == 53){
                  $rootScope.images.push("img/sources/54.png");
              }
              else if ($stateParams.playlistId == 55){
                  $rootScope.images.push("img/sources/56.png");
              }
              else if ($stateParams.playlistId == 57){
                  $rootScope.images.push("img/sources/58.png");
              }
              else if ($stateParams.playlistId == 59){
                  $rootScope.images.push("img/sources/60.png");
              }
              else if ($stateParams.playlistId == 61){
                  $rootScope.images.push("img/sources/62.png");
              }
              else if ($stateParams.playlistId == 63){
                  $rootScope.images.push("img/sources/64.png");
              }
              else if ($stateParams.playlistId == 65){
                  $rootScope.images.push("img/sources/66.png");
              }
              else if ($stateParams.playlistId == 67){
                  $rootScope.images.push("img/sources/68.png");
              }
              else if ($stateParams.playlistId == 69){
                  if (insteadposts[ii].content != null){
                    console.log(insteadposts[ii].content.url);
                    $rootScope.images.push(insteadposts[ii].content.url);
                  }
                  else{
                    $rootScope.images.push("img/sources/70.png");
                  }
              }
              else if ($stateParams.playlistId == 71){
                  $rootScope.images.push("img/sources/72.png");
              }
              else if ($stateParams.playlistId == 73){
                  $rootScope.images.push("img/sources/74.png");
              }
              else if ($stateParams.playlistId == 75){
                  $rootScope.images.push("img/sources/76.png");
              }
          }
        
      }
      console.log($rootScope.posts);

      if ($stateParams.playlistId == 12 || $stateParams.playlistId == 7){
            for (var i = 0; i<$rootScope.posts.length; i++){
                for (var j = i+1; j<$rootScope.posts.length; j++){
                    var d1=Date.parse($rootScope.posts[i].published);
                    var d2=Date.parse($rootScope.posts[j].published);
                    var temp;
                    if (d1<d2){
                        temp = $rootScope.posts[i];
                        $rootScope.posts[i]=$rootScope.posts[j];
                        $rootScope.posts[j]=temp;
                    }
                }
            }

            for (var i = 0; i<$rootScope.posts.length; i++){
                var d1=new Date();
                var d2=new Date($rootScope.posts[i].published);
                var diff = new Date(d1.getTime() - d2.getTime());
                var days = diff.getUTCDate()-1;
                var hours = diff.getUTCHours();
                var mins = diff.getUTCMinutes();

                if (days > 0){
                    $rootScope.posts[i].published = days + "d ago";
                }
                else if (hours > 0){
                    $rootScope.posts[i].published = hours + "h ago";
                }
                else if (mins > 0){
                    $rootScope.posts[i].published = mins + "m ago";
                }
                else {
                    $rootScope.posts[i].published = "Just posted";
                }
            }
      }
      else{
        for (var i = 0; i<$rootScope.posts.length; i++){
            for (var j = i+1; j<$rootScope.posts.length; j++){
                var d1=Date.parse($rootScope.posts[i].pubDate);
                var d2=Date.parse($rootScope.posts[j].pubDate);
                var temp;
                if (d1<d2){
                    temp = $rootScope.posts[i];
                    $rootScope.posts[i]=$rootScope.posts[j];
                    $rootScope.posts[j]=temp;
                }
            }
        }

        for (var i = 0; i<$rootScope.posts.length; i++){
            var d1=new Date();
            var d2=new Date($rootScope.posts[i].pubDate);
            var diff = new Date(d1.getTime() - d2.getTime());
            var days = diff.getUTCDate()-1;
            var hours = diff.getUTCHours();
            var mins = diff.getUTCMinutes();

            if (days > 0){
                $rootScope.posts[i].pubDate = days + "d ago";
            }
            else if (hours > 0){
                $rootScope.posts[i].pubDate = hours + "h ago";
            }
            else if (mins > 0){
                $rootScope.posts[i].pubDate = mins + "m ago";
            }
            else {
                $rootScope.posts[i].pubDate = "Just posted";
            }
        }
      }
      
    })
  }

  var url;
  $rootScope.images=[];
  url = $rootScope.urlList[$stateParams.playlistId];
  if ($stateParams.playlistId == 0 ){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId == 1 ){
    $scope.getTwitterFeed(url);
  }
  else if ($stateParams.playlistId == 2){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId == 3){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId == 4){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId == 5){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId == 6){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId == 7){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId == 8 ){
    $scope.getTwitterFeed(url);
  }
  else if ($stateParams.playlistId == 9){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId == 10){
    $scope.getTwitterFeed(url);
  }
  else if ($stateParams.playlistId == 11){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId == 12){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId % 2 == 1){
    $scope.getRssFeed(url);
  }
  else if ($stateParams.playlistId % 2 == 0){
    $scope.getTwitterFeed(url);
  }
  
  $scope.openbrowser = function (index) {
    var link;
    if ($rootScope.feed_type == 0){
      link = $rootScope.posts[index].link;
    }
    else if ($rootSccope.feed_type == 1){
      var position = $rootScope.posts[index].text.search("https://");
      link = $rootScope.posts[index].text.substring(position, position+23);
    }
    else{
      link = $rootScope.posts[index].link.href;
    }
    console.log(link);
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
   };
   $cordovaInAppBrowser.open(link, '_system', options)
    .then(function(event) {
    })
    .catch(function(event) {
    });
  }

  $scope.doRefresh = function(){
    if ($rootScope.feed_type == 0 || $rootScope.feedtype == 2){
      $scope.getRssFeed(url);
    }
    else{
      $scope.getTwitterFeed(url);
    }
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.moreOptions = function(){
    $scope.alert_flag = true;
    var hideSheet=$ionicActionSheet.show({
      buttons: [
        {text: '<b>Refresh</b>'},
        {text: '<b>Mark All as Read</b>'}
      ],
      titleText: 'More Options',
      cancelText: 'Cancel',
      cancel: function(){
        hideSheet();
      },
      buttonClicked:function(inded){
        return true;
      }
    });
  }

  $scope.cancelOptions = function(){
    $scope.alert_flag = false;
  }
})

.controller('ArticlePreviewCtrl', function($scope, $stateParams, $rootScope, $cordovaInAppBrowser, $sce, $state) {

    var article_position;
    article_position = $stateParams.articleId;
    
    $scope.beforeArticle = function(){
        if (article_position>0){
          article_position--;
          getPreviewArticle();
        }
    }

    var getPreviewArticle = function(){
      if ($rootScope.feed_type == 0){
            $rootScope.article_link = $sce.trustAsResourceUrl($rootScope.posts[article_position].link);
            console.log($rootScope.article_link);
            $scope.title = $rootScope.posts[article_position].title;
            $scope.time = $rootScope.posts[article_position].pubDate;
            if ($rootScope.posts[article_position].creator!=undefined)
              $scope.author = $rootScope.posts[article_position].creator;
            else
              $scope.author="";
            if ($rootScope.posts[article_position].link.includes("sbnation")){
              $scope.content = $rootScope.posts[article_position].description;
            }
            else{
              $scope.content = $rootScope.posts[article_position].description;
            }
            $scope.image = $rootScope.images[article_position];

            $scope.str_article_link = $rootScope.posts[article_position].link;
      }
      else if ($rootScope.feed_type == 1){
            var position = $rootScope.posts[article_position].text.search("https://");
            var linkk = $rootScope.posts[article_position].text.substring(position, position+23);

            $scope.str_article_link = linkk;

            $rootScope.article_link = $sce.trustAsResourceUrl(linkk);
            console.log($rootScope.article_link);
            $scope.title = $rootScope.posts[article_position].text;
            $scope.time = $rootScope.posts[article_position].created_at;
            if ($rootScope.posts[article_position].retweeted_status != undefined){
              $scope.author = $rootScope.posts[article_position].retweeted_status.user.name;
            }
            else{
              $scope.author = $rootScope.posts[article_position].user.name;
            }
            $scope.content = "";
            $scope.image = $rootScope.images[article_position]; 
      }
      else {

            if ($rootScope.posts[article_position].title.content != undefined){
              $scope.str_article_link = $rootScope.posts[article_position].link[0].href;
              $rootScope.article_link = $sce.trustAsResourceUrl($rootScope.posts[article_position].link[0].href);
              $scope.title = $rootScope.posts[article_position].title.content;
            }
            else{
              $scope.str_article_link = $rootScope.posts[article_position].link.href;
              $rootScope.article_link = $sce.trustAsResourceUrl($rootScope.posts[article_position].link.href);

              $scope.title = $rootScope.posts[article_position].title;
            }
            console.log($rootScope.article_link);
            
            $scope.time = $rootScope.posts[article_position].published;
            if ($rootScope.posts[article_position].author.name!=undefined)
              $scope.author = $rootScope.posts[article_position].author.name;
            else
              $scope.author="";

            if ($rootScope.posts[article_position].link.href != undefined){
                if ($rootScope.posts[article_position].link.href.includes("sbnation")){
                    $scope.content = $rootScope.posts[article_position].title;
                }
                else if ($rootScope.posts[article_position].summary == undefined){
                    $scope.content = $rootScope.posts[article_position].content.content;
                }
                else{
                    $scope.content = $rootScope.posts[article_position].summary.content;
                }
            }
            else{
              $scope.content = $rootScope.posts[article_position].summary.content;
            }
            
            $scope.image = $rootScope.images[article_position];
      }
    }

    $scope.afterArticle = function(){
        if (article_position < $rootScope.posts.length-1){
          article_position++;
          getPreviewArticle();    
        }
    }

    $scope.openbrowser = function () {

      if ($rootScope.feed_type == 1){

          console.log("linklinklinklinklink" + $rootScope.article_link);
          
          if ($scope.str_article_link.includes("http") && $scope.str_article_link.length == 23){
          }
          else{
            $rootScope.article_link="https://www.twitter.com/" + $rootScope.feedURL;
          }
          
          var options = {
            location: 'yes',
            clearcache: 'no',
            toolbar: 'yes'
         };
          $cordovaInAppBrowser.open($rootScope.article_link, '_system', options)
          .then(function(event) {
              console.log("success+"+JSON.stringify(event));
              $scope.showLoadingFlag = false;
          })
          .catch(function(event) {
            $scope.showLoadingFlag = false;
            console.log("success+"+JSON.stringify(event));
          });
      }
      else if($scope.str_article_link.includes("yahoo") || $scope.str_article_link.includes("sbnation") || $scope.str_article_link.includes("cbssport")){
          var options = {
            location: 'yes',
            clearcache: 'no',
            toolbar: 'yes'
         };
          $cordovaInAppBrowser.open($rootScope.article_link, '_system', options)
          .then(function(event) {
              console.log("success+"+JSON.stringify(event));
              $scope.showLoadingFlag = false;
          })
          .catch(function(event) {
            $scope.showLoadingFlag = false;
            console.log("success+"+JSON.stringify(event));
          });
      }      
      else{
        $state.go('app.article');
      }
      
    }
    getPreviewArticle();   
})

.controller('ArticleCtrl', function($scope, $ionicActionSheet, $timeout, $rootScope, $cordovaInAppBrowser) {
  $scope.link = $rootScope.article_link;
  $scope.opensafari = function(url){
    var hideSheet=$ionicActionSheet.show({
      buttons: [
        {text: '<b>Open Safari</b>'}
      ],
      titleText: 'Other Options',
      cancelText: 'Cancel',
      cancel: function(){
        hideSheet();
      },
      buttonClicked:function(inded){
        $scope.showLoadingFlag = true;
         var options = {
            location: 'yes',
            clearcache: 'no',
            toolbar: 'yes'
         };
        $cordovaInAppBrowser.open($rootScope.article_link, '_system', options)
        .then(function(event) {
            console.log("success+"+JSON.stringify(event));
            $scope.showLoadingFlag = false;
        })
        .catch(function(event) {
          $scope.showLoadingFlag = false;
          console.log("success+"+JSON.stringify(event));
        });
        return true;
      }
    });
  };
})

.controller('LiveScoresCtrl', function($scope, dataService1) {
    $scope.scoreData = [];
    $scope.showLoadingFlag = true;
    var today = new Date("2017-01-02");
    //var today = new Date();
    today = new Date(today.getTime() + 60*60*24*1000*7)
    var count = 0;
    
    for (var i=0; i<15; i++){
        today = new Date(today.getTime() - 60*60*24*1000);
        var dd=today.getDate();
        var mm=today.getMonth()+1;
        var yyyy=today.getFullYear();
        if (dd<10){
          dd='0'+dd;
        }
        if (mm<10){
          mm='0'+mm;
        }
        var date = yyyy+""+mm+""+dd;
        
        dataService1.getData(date).then(function(dataResponse){
            count++;
            if (dataResponse.data.scoreboard.gameScore != undefined){
              $scope.scoreData.push(dataResponse.data.scoreboard.gameScore);
              console.log($scope.scoreData);
            }
            if (count == 15){
                $scope.showLoadingFlag = false;
                for (var i = 0; i<$scope.scoreData.length; i++){
                    for (var j = i+1; j<$scope.scoreData.length; j++){
                        var d1=Date.parse($scope.scoreData[i][0].game.date);
                        var d2=Date.parse($scope.scoreData[j][0].game.date);
                        var temp;
                        if (d1<d2){
                            temp = $scope.scoreData[i];
                            $scope.scoreData[i]=$scope.scoreData[j];
                            $scope.scoreData[j]=temp;
                        }
                    }
                }

                for (var k = 0; k<$scope.scoreData.length; k++){
                    var temp_date = new Date($scope.scoreData[k][0].game.date);
                    var ddd=temp_date.getUTCDate();
                    var mmm=temp_date.getUTCMonth()+1;
                    var yyyyy=temp_date.getUTCFullYear();
                    if (ddd<10){
                      ddd='0'+ddd;
                    }
                    if (mmm<10){
                      mmm='0'+mmm;
                    }
                    $scope.scoreData[k][0].game.date=mmm+"/"+ddd+"/"+yyyyy;
                }

            }
        });
    }

    $scope.refresh = function(){
        $scope.scoreData = [];
        $scope.showLoadingFlag = true;
        var today = new Date("2017-01-02");
        today = new Date(today.getTime() + 60*60*24*1000*7)
        var count = 0;
        
        for (var i=0; i<15; i++){
            today = new Date(today.getTime() - 60*60*24*1000);
            var dd=today.getDate();
            var mm=today.getMonth()+1;
            var yyyy=today.getFullYear();
            if (dd<10){
              dd='0'+dd;
            }
            if (mm<10){
              mm='0'+mm;
            }
            var date = yyyy+""+mm+""+dd;
            
            dataService1.getData(date).then(function(dataResponse){
                count++;
                if (dataResponse.data.scoreboard.gameScore != undefined){
                  $scope.scoreData.push(dataResponse.data.scoreboard.gameScore);
                  console.log($scope.scoreData);
                }
                if (count == 15){
                    $scope.showLoadingFlag = false;
                    for (var i = 0; i<$scope.scoreData.length; i++){
                        for (var j = i+1; j<$scope.scoreData.length; j++){
                            var d1=Date.parse($scope.scoreData[i][0].game.date);
                            var d2=Date.parse($scope.scoreData[j][0].game.date);
                            var temp;
                            if (d1<d2){
                                temp = $scope.scoreData[i];
                                $scope.scoreData[i]=$scope.scoreData[j];
                                $scope.scoreData[j]=temp;
                            }
                        }
                    }

                    for (var k = 0; k<$scope.scoreData.length; k++){
                        var temp_date = new Date($scope.scoreData[k][0].game.date);
                        var ddd=temp_date.getUTCDate();
                        var mmm=temp_date.getUTCMonth()+1;
                        var yyyyy=temp_date.getUTCFullYear();
                        if (ddd<10){
                          ddd='0'+ddd;
                        }
                        if (mmm<10){
                          mmm='0'+mmm;
                        }
                        $scope.scoreData[k][0].game.date=mmm+"/"+ddd+"/"+yyyyy;
                    }

                }
            });
        }
    }
})

.controller('ManageFeedsCtrl', function($scope, $stateParams,$ionicActionSheet, $timeout, $localStorage, $rootScope) {

  $scope.selectFeeds = function(id){
      $rootScope.playlists[id-1].checked = !$rootScope.playlists[id-1].checked;
      $localStorage['newslists'] = $rootScope.playlists;
  }

  $scope.selectAll = function(){
    $scope.alert_flag = true;
    var hideSheet=$ionicActionSheet.show({
      buttons: [
        {text: '<b>Select All</b>'}
      ],
      titleText: 'More Options',
      cancelText: 'Cancel',
      cancel: function(){
        hideSheet();
      },
      buttonClicked:function(index){
        for (var k=0; k<$rootScope.playlists.length; k++){
          if (k!=11){
              $rootScope.playlists[k].checked = true;  
          }
          else{
              $rootScope.playlists[k].checked = false;   
          }
        }
        $localStorage['newslists'] = $rootScope.playlists;
        return true;
      }
    });
  };
});


















