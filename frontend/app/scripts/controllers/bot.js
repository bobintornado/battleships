'use strict';

angular.module('frontendApp')
  .controller('BotCtrl', function ($scope, Bot) {
    $scope.playerOptions = {
      lineWrapping : true,
      lineNumbers: true,
      theme: 'monokai',
      mode: 'javascript',
      autoCloseBrackets: true
    };

    $scope.botOptions = {
      lineWrapping : true,
      lineNumbers: true,
      theme: 'monokai',
      mode: 'javascript',
      autoCloseBrackets: true
    };

    $scope.bots = Bot.getAllBots();

    $scope.currentLevel = 1;
    
    $scope.playerBot = 'function getMove(boardStr) {}';

    $scope.saveBot = function(){
      Bot.saveBot($scope.playerBot);
      console.log($scope.playerBot);
      $scope.bots = Bot.getAllBots();
    };

    $scope.loadBot = function(){
      
    };
  });
