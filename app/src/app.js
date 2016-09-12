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
            // params: {},
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token token=031488b51ba97cd59d3934f56f21c355',
                'Accept': 'application/vnd.stattleship.com; version=1'
            }
        });
    }
})

.factory('generateStats', function() {

    // Define objects that will hold teams
    var alTeamStats = {
        teams: []
    };
    var nlTeamStats = {
        teams: []
    };

    return {

        // Push data into team stats objects
        pushToObject: function(obj, team, team_stats, conf) {

            obj.teams.push({
                name: team.name,
                nickName: team.nickname,
                colors: team.colors,
                wins: team_stats.wins,
                losses: team_stats.losses,
                balls: team_stats.balls,
                hits: team_stats.hits,
                runs: team_stats.runs,
                singles: team_stats.singles,
                doubles: team_stats.doubles,
                triples: team_stats.triples,
                rbis: team_stats.rbi,
                era: team_stats.era,
                runs_allowed: team_stats.runs_allowed,
                double_plays: team_stats.double_plays,
                triple_plays: team_stats.triple_plays,
                division_id: team.division_id
            })
        },

        // Iterate of api data
        iterateLeagueData: function(data) {

            var alConfernceId = data.divisions[0].conference_id;
            var nlConferenceId = data.divisions[1].conference_id;
            var alEastDivisionId = data.divisions[0].id;
            var nlEastDivisionId = data.divisions[1].id;
            var nlWestDivisionId = data.divisions[2].id;
            var alWestDivisionId = data.divisions[3].id;
            var nlCentralDivisionId = data.divisions[4].id;
            var alCentralDivisionId = data.divisions[5].id;

            // iterate through data to sort by teams and then send to push func to be pushed into conference array
            for (var i = 0; i < data.teams.length; i++) {
                if (
                    data.teams[i].id === data.team_season_stats[i].team_id &&
                    data.teams[i].division_id === alEastDivisionId ||
                    data.teams[i].division_id === alWestDivisionId ||
                    data.teams[i].division_id === alCentralDivisionId
                ) {
                    var conference = 'American League';
                    this.pushToObject(alTeamStats, data.teams[i], data.team_season_stats[i], conference);

                } else {
                    var conference = 'National League';
                    this.pushToObject(nlTeamStats, data.teams[i], data.team_season_stats[i], conference);
                }
            }

            // Return objects containing teams and their stats
            return [alTeamStats, nlTeamStats];
        }
    }
})

.directive('mainContent', function(callAPI, generateStats) {
    return {
        restrict: 'A',
        templateUrl: './src/views/mainContent-template.html',
        controller: function controller($scope, $element, $attrs) {


            // Call API factory
            callAPI().success(function(results) {
                console.log(results);
                $scope.standings = generateStats.iterateLeagueData(results);
                console.log($scope.standings);
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
