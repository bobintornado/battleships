'use strict';

angular.module('frontendApp')
  .controller('BoardCtrl', function ($scope, Board) {
    $scope.isShip = function(val){
      return val === 's' && $scope.settings.gameStart;
    };

    $scope.isMiss = function(val){
      return val === 'm';
    };

    $scope.isHit = function(val){
      return val === 'h';
    };

    $scope.$watch('board', function(newVal, oldVal){
      //Update board logic
    }, true);
  });
