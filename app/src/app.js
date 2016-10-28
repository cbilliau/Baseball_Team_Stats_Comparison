angular.module('baseballStatsApp', ['ngMaterial', 'ngMdIcons'])

.config(function($mdIconProvider, $mdThemingProvider, $httpProvider, $mdAriaProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // define the icon names for shortcuts and icon locations
    $mdIconProvider
        .defaultIconSet('./assets/svg/logos.svg', 128)
        .icon('filter', './assets/svg/filter.svg', 24)
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
            url: 'https://api.stattleship.com/baseball/mlb/team_season_stats?season_id=mlb-2016&interval_type=regularseason',
            // adding n=today& after 'mlb-2016' will work ony during reg season
            // change season_id to year needed. Look at adding this to eventual dropdown menu item
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

        // Assign id for avatar using team nickname with spaces removed
        teamData.avatar = team.nickname.replace(/\s+/g, '');

        // Assign teams to al or nl league array
        if (team.league === 'al') {
            alData.teams.push(teamData);
        } else {
            nlData.teams.push(teamData);
        }
    }


    function classifyTeam(team, teamStats) {

        if (
            team.id === teamStats.team_id &&
            team.division_id === nlEastDivisionId ||
            team.division_id === nlWestDivisionId ||
            team.division_id === nlCentralDivisionId
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

            // iterate through data to sort by teams
            for (var i = 0; i < data.teams.length; i++) {
                classifyTeam(data.teams[i], data.team_season_stats[i]);
            }

            return [alData, nlData];
        }
    }
})

.service('statNameService', function() {

    // statNames bind mainContent display and bottomSheet checkboxes
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
        controller: function($scope, $element, $attrs, $mdSidenav, $mdBottomSheet, $mdDialog) {

            // Set var
            $scope.content = [];
            $scope.showNlStats = false;
            $scope.showAlStats = false;
            $scope.statNames = statNameService.getStatNames();

            // Call api
            $scope.getSetData = callAPI().success(function(results) {
                $scope.dataTeams = generateStats.iterateLeagueData(results);
                $scope.alTeamStats = $scope.dataTeams[0].teams;
                $scope.nlTeamStats = $scope.dataTeams[1].teams;
            });

            // Instructions modal
            $scope.showModal = function () {
              $mdDialog.show(
                $mdDialog.alert()
                  .clickOutsideToClose(true)
                  .title('Instructions')
                  .textContent('Choose one NL and one AL team from the roster on the left to compare team stats. Click the filter fab to show/hide stats.')
                  .ariaLabel('Alert Dialog')
                  .ok('Got it!')
              );
            };

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
                $scope.showNlStats = true;
                var sidenav = $mdSidenav('left');
                if (sidenav.isOpen());
                sidenav.close();
            };

            $scope.selectAlTeam = function(team) {
                $scope.selectedAl = team;
                $scope.showAlStats = true;
                var sidenav = $mdSidenav('left');
                if (sidenav.isOpen());
                sidenav.close();
            };
        }
    }
});
