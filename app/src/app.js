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

      .service('appService', function($http, $q) {
          let service = this;
          let url = 'https://erikberg.com/mlb/standings.json';
          service.getStats = function() {
              $http.get(url)
                  .then(function(response) {
                      return $q.when(response);
                  }),
                  function(response) {
                    alert('error');
                  };
          }
      })

      .directive('mainContent', function (appService) {
        return {
          restrict: 'A',
          templateUrl: './src/views/teamComparison-template.html',
          controller: function controller($scope, $element, $attrs) {
            this.appService = appService;
            this.data = this.appService.getStats()
            console.log(this.data);
        }
      }
    });
