'use strict'

angular.module('teamComparison', ['appService'])
  .directive('mainContent', function (appService) {
    return {
      restrict: 'E',
      templateUrl: 'teamComparison-template.html',
      controller: function controller($scope, $element, $attrs) {
        
      }
    }
  });
