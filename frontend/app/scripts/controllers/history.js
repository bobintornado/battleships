'use strict';

angular.module('frontendApp')
  .controller('HistoryCtrl', function ($scope, history) {
    $scope.history = history;

    $scope.isMiss = function(val){
      return val === 'm';
    };

    $scope.isHit = function(val){
      return val === 'h';
    };
  });
