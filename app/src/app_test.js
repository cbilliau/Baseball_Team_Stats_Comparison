describe('callAPI', function() {
    beforeEach(module('baseballStatsApp'));

    it('should query the backend when app opens',
        inject(function(callAPI, $rootScope, $httpBackend) {
            $httpBackend.expect('GET', 'https://api.stattleship.com/baseball/mlb/team_season_stats').respond(200);
            var status = false;
            callAPI().then(function() {
                status = true;
            });
            $rootScope.$digest();
            $httpBackend.flush();
            expect(status).toBe(true);
            $httpBackend.verifyNoOutstandingRequest();
        }));
});

xdescribe('generateStats.pushToObject', function() {
    beforeEach(module('baseballStatsApp'));

    it('should push an object into an array', inject(function(generateStats.pushToObject) {

    }))
  });
