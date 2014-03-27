'use strict';

angular.module('frontendApp')
  .factory('Bot', function ($http, $q) {
    return {
      saveBot: function (bot) {
        var response = $q.defer();

        $http.post('Bot/create', bot).then(function(res){
          response.resolve(res.data);
        });

        return response.promise;
      },
      getAllBots: function(){
        var bots = $q.defer();

        $http.get('Bot/all').then(function(res){
          bots.resolve(res.data);
        });

        return bots.promise;
      },
      getChallengeBots: function(){
        return [];
      },
    };
  });
