angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('BreweriesCtrl', function($scope, $http, BreweryPassingService) {
    //var baseUrl = 'https://api.brewerydb.com/v2/';
    //var breweryDBKey = '?key=fd038434276f4a9e7d6a19ee2d8aa5b5';
    //$scope.breweries = [];
    //
    //$http.get(baseUrl + 'locations/' + breweryDBKey + '&locality=Kansas%20City').then(function (resp) {
    //  console.log('Success', resp.data);
    //
    //  angular.forEach(resp.data.data, function(item) {
    //    $scope.breweries.push(item);
    //  });
    //}, function(err) {
    //  console.error('ERR', err);
    //});
    //
    //$scope.passBreweryToBreweryView = function(brewery) {
    //  $scope.BreweryPassingService = BreweryPassingService;
    //  BreweryPassingService.selectedBrewery = brewery;
    //}
    //
    //function getBreweryById($scope, id) {
    //  $http.get('http://api.brewerydb.com/v2/brewery/' + id + '?key=fd038434276f4a9e7d6a19ee2d8aa5b5').then(function(resp) {
    //    console.log('Success - Brewery with id ' + id, resp.data);
    //    return resp.data
    //  }, function(err) {
    //    console.error('ERR', err);
    //  });
    //}

    function MainBrewery(brewery) {
      this.perform = function() {
        console.log("This is a main brewery for " + brewery + ".");
      }
    }

    function Taproom(brewery) {
      this.perform = function() {
        console.log("This is not a brewery. It is a taproom for " + brewery + ".");
      }
    }

    function TwoBarrelSystem(brewery) {
      this.perform = function() {
        console.log("This " + brewery + " location has a two barrel system.");
      }
    }

    function FiveBarrelSystem(brewery) {
      this.perform = function() {
        console.log("This " + brewery + " location has a five barrel system.");
      }
    }

    function TwoBarrelBreweryBuilder(breweryName) {
      this.getBrewery = function() { return new MainBrewery(breweryName); }
      this.getBrewerySystem = function() { return new TwoBarrelSystem(breweryName); }
    }

    function BreweryBuilder() {
      this.build = function(builder) {
        var brewery = builder.getBrewery();
        var brewerySystem = builder.getBrewerySystem();
        return {
          brewery: brewery,
          brewerySystem: brewerySystem,
          test: function test() {
            this.brewery.perform();
            this.brewerySystem.perform();
          }
        }
      }
    }

    var bName = "Cinder Block Brewery";

    var breweryBuilder = new BreweryBuilder(),
      twoBarrelBrewery = new TwoBarrelBreweryBuilder(bName),
      build = breweryBuilder.build(twoBarrelBrewery);

    build.test();

    executeFlyweightExample();

    function executeFlyweightExample() {
      
    }
  }




  )
  /*
  Used to pass a brewery from BreweriesCtrl to BreweryCtrl
   */
  .factory('BreweryPassingService',function(){
    return {brewery:{}}
  })

  .controller('BreweryCtrl', function($scope, $stateParams, $http, BreweryPassingService, getBeersForBreweryService) {
    $scope.BreweryPassingService=BreweryPassingService;
    $scope.brewery = BreweryPassingService.selectedBrewery;
    var breweryId = $scope.brewery.breweryId;

    $scope.beers = [];

    $scope.beers = getBeersForBreweryService.getBeers(breweryId).then(function(data) {
      console.log(data);
    }).fail(function(err) {err.error});


    //getBeersForBrewery(breweryId);
    //console.log('Success - Brewery with id ' + breweryId + ' has the following beerss: ', $scope.beers);
    //function getBeersForBrewery($scope, $http, breweryId) {
    //  var baseUrl = 'https://api.brewerydb.com/v2/';
    var breweryDBKey = '?key=fd038434276f4a9e7d6a19ee2d8aa5b5';
    //
    //  //$http.get('http://api.brewerydb.com/v2/brewery/' + breweryId + '/beers/' + breweryDBKey).then(function (resp) {
    //  //
    //  //  $scope.beers = resp.data;
    //  //  console.log('Success - Brewery with id ' + breweryId + ' has the following beers: ', resp.data);
    //  //}, function (err) {
    //  //  console.error('ERR', err);
    //  //});
    //}

    //this.getBeers = getBeersForBreweryService.getBeers('http://api.brewerydb.com/v2/brewery/' + breweryId + '/beers/' + breweryDBKey).success(function () {
    //  $scope.beers =
    //}).error(function(err) {
    //  console.error('ERR', err);
    //});
    //beersPromise.then(function(data) {
    //  $scope.beers = data;
    //})


  })

  .service('getBeersForBreweryService', function($http) {
    var that = this;
    var breweryDBKey = '?key=fd038434276f4a9e7d6a19ee2d8aa5b5';
    this.beers = [];

    this.initBeers = function(breweryId) {
      $http.get('http://api.brewerydb.com/v2/brewery/' + breweryId + '/beers/' + breweryDBKey).success(function(data) {
        console.log('getting beers -----> ' + data.data);
        that.beers = data.data;
      })
    };

    this.getBeers = function(breweryId) {
      return this.initBeers(breweryId);
    }
  });

  //.service("getBeersForBreweryService", function($http, $q, breweryDBURL) {
  //  var deferredBeers = $q.defer();
  //  $http.get(breweryDBURL).then(function(data){
  //    deferredBeers.resolve(data);
  //  })
  //  this.getBeers = function(breweryDBURL) {
  //    return deferredBeers;
  //  }
  //})




