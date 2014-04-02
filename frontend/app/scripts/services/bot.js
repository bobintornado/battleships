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
      getSample: function(language){
        switch(language){
          case 'javascript':
            return 'function getMove(boardStr) {\n  //Write your code here...\n  return boardStr;\n}';
          case 'java':
            return 'public static void getMove(String boardStr){\n  //Write your code here...\n  return boardStr;\n}';
          case 'python':
            return 'def getMove(boardStr):\n  //Write your code here\n  return boardStr';
        }
      }
    };
  });
