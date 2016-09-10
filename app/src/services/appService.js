'use strict'

angular.module('appService', [])
    .service(function($http, $q) {
        let url = 'https://erikberg.com/mlb/standings.json';

        let getStats = function() {
            $http.get(url)
                .then(function(response) {
                    return $q.when(response);
                });
        }

        getStats()
            .then(function(data) {
                console.log(data);
            });
    });
