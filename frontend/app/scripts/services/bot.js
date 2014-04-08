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

        $http.get('Bot/all').success(function(data){
          bots.resolve(data);
        });

        return bots.promise;
      },
      getChallengeBots: function(){
        var bots = $q.defer();

        $http.get('Bot/percentile10').success(function(data){
          bots.resolve(data);
        });

        return bots.promise;
      },
      getSample: function(language){
        switch(language){
          case 'js':
            return 'function getMove(boardStr) {\n  // Your code should return a string like:\n  // ----b--|-------|-------|-------|-------|-------|-------\n  // Where "b" is where you want to place your bomb\n\n  return boardStr.replace("-","b");\n}';
          case 'java':
            return 'public static String getMove(String boardStr){\n  //Write your code here...\n  return boardStr.replace("-","b");\n}';
          case 'python':
            return 'def getMove(boardStr):\n  # Your code should return a string like:\n  # ----b--|-------|-------|-------|-------|-------|-------\n  # Where "b" is where you want to place your bomb\n\n  return boardStr.replace("-","b",1)';
        }
      }
    };
  });
