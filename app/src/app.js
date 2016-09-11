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

// Placeholder for controller if needed
.controller('mainController', function(mainContent, sideBar) {})

.factory('callAPI', function($http) {
    return function() {
        return $http({
            method: 'GET',
            url: 'https://api.stattleship.com/baseball/mlb/team_season_stats',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token token=031488b51ba97cd59d3934f56f21c355',
                'Accept': 'application/vnd.stattleship.com; version=1'
            }
        });
    }
})

.factory('generateStandings'function() {
    return function(data) {
      
    }
})


.directive('mainContent', function(callAPI) {
    return {
        restrict: 'A',
        templateUrl: './src/views/mainContent-template.html',
        controller: function controller($scope, $element, $attrs) {


            // Call API factory
            callAPI().success(function(results) {
                console.log(results.conferences[0].league_id);
                console.log(results.conferences[0].name);
                console.log(results.divisions[0].conference_id);
                console.log(results.divisions[0].name);
                console.log(results.teams[0].id);
                console.log(results.teams[0].name);


                // $scope.callAPIData = results;
            });
        }
    }
})

.directive('sideBar', function() {
    return {
        restrict: 'A',
        templateUrl: './src/views/sideBar-template.html',
        controller: function controller($scope, $element, $attrs, $timeout) {




            // In this example, we set up our model using a class.
            // Using a plain object works too. All that matters
            // is that we implement getItemAtIndex and getLength.
            var DynamicItems = function() {
                /**
                 * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
                 */
                this.loadedPages = {};

                /** @type {number} Total number of items. */
                this.numItems = 0;

                /** @const {number} Number of items to fetch per request. */
                this.PAGE_SIZE = 50;

                this.fetchNumItems_();
            };

            // Required.
            DynamicItems.prototype.getItemAtIndex = function(index) {
                var pageNumber = Math.floor(index / this.PAGE_SIZE);
                var page = this.loadedPages[pageNumber];

                if (page) {
                    return page[index % this.PAGE_SIZE];
                } else if (page !== null) {
                    this.fetchPage_(pageNumber);
                }
            };

            // Required.
            DynamicItems.prototype.getLength = function() {
                return this.numItems;
            };

            DynamicItems.prototype.fetchPage_ = function(pageNumber) {
                // Set the page to null so we know it is already being fetched.
                this.loadedPages[pageNumber] = null;

                // For demo purposes, we simulate loading more items with a timed
                // promise. In real code, this function would likely contain an
                // $http request.
                $timeout(angular.noop, 300).then(angular.bind(this, function() {
                    this.loadedPages[pageNumber] = [];
                    var pageOffset = pageNumber * this.PAGE_SIZE;
                    for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
                        this.loadedPages[pageNumber].push(i);
                    }
                }));
            };

            DynamicItems.prototype.fetchNumItems_ = function() {
                // For demo purposes, we simulate loading the item count with a timed
                // promise. In real code, this function would likely contain an
                // $http request.
                $timeout(angular.noop, 300).then(angular.bind(this, function() {
                    this.numItems = 50000;
                }));
            };

            this.dynamicItems = new DynamicItems();
        }
    }
});
