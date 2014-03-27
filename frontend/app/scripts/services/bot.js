'use strict';

angular.module('frontendApp')
  .factory('Bot', function ($http) {
    var bots = [];
    return {
      saveBot: function (bot) {
        bots.push(bot);
      },
      getAllBots: function(){
        $http.get('Bot/all').then(function(res){
          console.log(res.data);
          return res.data;
        });
      },
      getChallengeBots: function(){
        return bots;
      }
    };
  });
