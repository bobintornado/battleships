'use strict';

angular.module('frontendApp')
  .controller('BoardCtrl', function ($scope, Board) {
    $scope.board = Board.initializeBoards().then(function(data){
      $scope.board = $scope.parseBoard(data.player);
    });

    $scope.parseBoard = function(boardStr){
      var output = [];
      var rows = boardStr.split('|');

      rows.forEach(function(el){
        var row = [];

        el.split('').forEach(function(cell){
          cell = cell === '-' ? '' : cell;
          row.push(cell);
        });

        output.push(row);
      });

      return output;
    };

    $scope.isShip = function(val){
      return val === 's';
    };
  });
