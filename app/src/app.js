'use strict'

angular.module('baseballStatsApp', ['ngMaterial', 'ngMdIcons'])

.config(function($mdIconProvider, $mdThemingProvider, $httpProvider) {
    // $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // define the icon names for shortcuts and icon locations
    $mdIconProvider
        .defaultIconSet('./assets/svg/avatars.svg', 128)
        .icon('menu', './assets/svg/menu.svg', 24);
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
    var alData = {
        teams: []
    };
    var nlData = {
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
                    this.pushToObject(alData, data.teams[i], data.team_season_stats[i], conference);
                } else {
                    var conference = 'National League';
                    this.pushToObject(nlData, data.teams[i], data.team_season_stats[i], conference);
                }
            }

            // Return objects containing teams and their stats
            return [alData, nlData];
        }
    }
})

.directive('appContainer', function(callAPI, generateStats) {
    return {
        replace: false,
        restrict: 'E',
        controller: function($scope, $element, $attrs) {
            $scope.content = [];

            this.addMainContent = function() {
                $scope.content.push('mainContent');
            };

            this.addSideBar = function() {
                $scope.content.push('sideBar');
            };
            callAPI().success(function(results) {
                var teamStats;
                teamStats = generateStats.iterateLeagueData(results);
                console.log(results);
                console.log(teamStats);
            });
        }
    }
})

.directive('mainContent', function() {
    return {
        require: '^appContainer',
        restrict: 'A',
        templateUrl: './src/views/mainContent-template.html',
        link: function(scope, element, attrs, appContainerCtrl) {
            appContainerCtrl.addMainContent();
        },
        controller: function controller($scope, $element, $attrs, $mdSidenav, $mdBottomSheet) {

            $scope.toggleSideNav = function() {
                $mdSidenav('left').toggle();
            };
        }
    }
})

.directive('sideBar', function() {
    return {
        require: '^appContainer',
        restrict: 'A',
        templateUrl: './src/views/sideBar-template.html',
        link: function(scope, element, attrs, appContainerCtrl) {
            appContainerCtrl.addSideBar();
        },
        controller: function controller($scope, $element, $attrs, $timeout) {

        }
    }
});
