'use strict';

angular.module('frontendApp')
  .factory('Board', function () {

    return {
      initializeBoards: function () {
        // Make API call here to backend to get a board
        // Currently return a test board
        var reply = {
          player: '---OOO-|O------|O------|O------|O------|O------|--OOOO-',
          bot: '---OOO-|O------|O------|O------|O------|O------|--OOOO-'
        };

        return reply;
      }
    };
  });
