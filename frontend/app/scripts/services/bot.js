'use strict';

angular.module('frontendApp')
  .factory('Bot', function ($http) {
    var bots = [
      {
        name: 'SuperBot',
        code: 'function(x){}'
      }
    ];

    return {
      saveBot: function (bot) {
        bots.push(bot);
      },
      getAllBots: function(){
        return bots;
      },
      getChallengeBots: function(){
        return bots;
      }
    };
  });
