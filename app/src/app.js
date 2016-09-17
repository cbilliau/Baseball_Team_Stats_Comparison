

angular.module('baseballStatsApp', ['ngMaterial', 'ngMdIcons'])

.config(function($mdIconProvider, $mdThemingProvider, $httpProvider, $mdAriaProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // define the icon names for shortcuts and icon locations
    $mdIconProvider
        .defaultIconSet('./assets/svg/logos.svg', 128)
        .icon('menu', './assets/svg/menu.svg', 24);
    // define theme pallete
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red');
    $mdAriaProvider.disableWarnings();
})

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

    function pushToObject(team, team_stats) {

        var teamData = {
            city: team.name,
            team: team.nickname,
            avatar: team.nickname,
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
        }

        if (team.league === 'al') {
          alData.teams.push(teamData);
        } else {
          nlData.teams.push(teamData);
        }
    }

    function classifyTeam(team, teamStats) {
      if (
          team.id === teamStats.team_id &&
          team.division_id === alEastDivisionId ||
          team.division_id === alWestDivisionId ||
          team.division_id === alCentralDivisionId
      ) {
          team.league = 'al';
          // American League Push
          pushToObject(team, teamStats);
      } else {
          team.league = 'nl';
          // National League Push
          pushToObject(team, teamStats);
      }

    }

    return {
        iterateLeagueData: function(data) {

            alConfernceId = data.divisions[0].conference_id;
            nlConferenceId = data.divisions[1].conference_id;
            alEastDivisionId = data.divisions[0].id;
            nlEastDivisionId = data.divisions[1].id;
            nlWestDivisionId = data.divisions[2].id;
            alWestDivisionId = data.divisions[3].id;
            nlCentralDivisionId = data.divisions[4].id;
            alCentralDivisionId = data.divisions[5].id;

            // iterate through data to sort by teams and then send to push func to be pushed into conference array
            for (var i = 0; i < data.teams.length; i++) {
                classifyTeam(data.teams[i], data.team_season_stats[i]);
            }

            return [alData, nlData];
        }
    }
})

.service('statNameService', function() {

    var statNames = {}
    statNames.Wins = true;
    statNames.Losses = true;
    statNames.Balls = true;
    statNames.Hits = true;
    statNames.Runs = true;
    statNames.Singles = true;
    statNames.Doubles = true;
    statNames.Triples = true;
    statNames.RBI = true;
    statNames.ERA = true;
    statNames.RunsAllowed = true;
    statNames.DoublePlays = true;
    statNames.TriplePlays = true;

    return {
        getStatNames: function() {
            return statNames;
        }
    }
})

.directive('appContainer', function(callAPI, generateStats, statNameService) {
    return {
        replace: false,
        restrict: 'E',
        controllerAs: 'vm',
        controller: function($scope, $element, $attrs, $mdSidenav, $mdBottomSheet) {

            // Set var
            var vm = this;
            $scope.content = [];
            $scope.statNames = statNameService.getStatNames();

            // Call api
            vm.getSetData = callAPI().success(function(results) {
                $scope.dataTeams = generateStats.iterateLeagueData(results);
                console.log($scope.dataTeams);
                $scope.alTeamStats = $scope.dataTeams[0].teams;
                $scope.nlTeamStats = $scope.dataTeams[1].teams;
            });

            $scope.showToggleStatsSheet = function($event) {
                $mdBottomSheet.show({
                    parent: angular.element(document.getElementById('wrapper')),
                    templateUrl: './src/views/toggleStatsSheet-template.html',
                    targetEvent: $event,
                    link: function(scope, element, attrs) {
                        $scope.content.push('bottomSheet');
                    }
                })
            };
        }
    }
})

.directive('mainContent', function() {
    return {
        require: '^appContainer',
        restrict: 'A',
        templateUrl: './src/views/mainContent-template.html',
        link: function($scope, element, attrs, appContainerCtrl) {
            $scope.content.push('mainContent');
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
        link: function($scope, element, attrs) {
            $scope.content.push('sideBar');
        },
        controller: function controller($scope, $element, $attrs, $timeout, $mdSidenav) {

            $scope.selectNlTeam = function(team) {
                $scope.selectedNl = team;
                var sidenav = $mdSidenav('left');
                if (sidenav.isOpen());
                sidenav.close();
            };

            $scope.selectAlTeam = function(team) {
                $scope.selectedAl = team;
                var sidenav = $mdSidenav('left');
                if (sidenav.isOpen());
                sidenav.close();
            };

        }
    }
});
