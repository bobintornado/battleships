'use strict';

angular.module('frontendApp')
  .factory('Board', function () {
    var shipLengths = [5,4,3,3,2];

    var getEmptyBoard = function(){
      var board = [];

      for(var i = 0; i < 7; i++){
        var row = [];
      
        for(var j = 0; j < 7; j++){
          row.push('-');
        }
      
        board.push(row);
      }

      return board;
    };


    var getPoint = function(ship, board){
      
    };

    var generateBoard = function(){
      var board = getEmptyBoard();
      
      shipLengths.forEach(function(ship){
        var point = getPoint(ship, board);

      });
    };

    return {
      initializeBoards: function () {
        // Make API call here to backend to get a board
        // Currently return a test board
        var reply = {
          player: '-------|sssss--|----s--|----s--|-s--ss-|-s--ss-|sss--s-',
          bot: '-------|sssss--|----s--|----s--|-s--ss-|-s--ss-|sss--s-'
        };

        return reply;
      }
    };
  });
