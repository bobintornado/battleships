'use strict';

angular.module('frontendApp')
  .controller('BoardCtrl', function ($scope, Board) {
    $scope.isShip = function(val){
      return val === 's';
    };

    $scope.$watch('board', function(newVal, oldVal){
      //Update board logic
    }, true);
  });
