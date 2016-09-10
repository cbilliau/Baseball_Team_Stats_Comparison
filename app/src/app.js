'use strict'

angular.module('baseballStatsApp', ['ngMaterial', 'ngMdIcons'])

.config(function($mdIconProvider, $mdThemingProvider, $httpProvider) {
    // $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // define the icon names for shortcuts and icon locations
    // $mdIconProvider
    //     .defaultIconSet()
    //     .icon();
    // define theme pallete
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red');
})


.factory('standings', function($http) {
    return function() {
        return $http({
            url: 'https://erikberg.com/mlb/standings.json'
        });
    }
})


.directive('mainContent', function(standings) {
    return {
        restrict: 'A',
        templateUrl: './src/views/mainContent-template.html',
        controller: function controller($scope, $element, $attrs) {

            // Call factory
            standings().success(function(results) {
                $scope.standingsData = results;
                console.log($scope.standingsData);
            });
        }
    }
})

.directive('sideBar', function(standings) {
  return {
      restrict: 'A',
      templateUrl: './src/views/sideBar-template.html',
      controller: function controller($scope, $element, $attrs) {

          // Call factory
          standings().success(function(results) {
              $scope.standingsData = results;
              console.log($scope.standingsData);
          });
      }
  }
})
