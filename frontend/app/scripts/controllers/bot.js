'use strict';

angular.module('frontendApp')
  .controller('BotCtrl', function ($scope, Bot) {
    $scope.playerOptions = {
      lineWrapping : true,
      lineNumbers: true,
      theme: 'monokai',
      mode: $scope.settings.language,
      autoCloseBrackets: true
    };

    $scope.botOptions = {
      lineWrapping : true,
      lineNumbers: true,
      theme: 'monokai',
      mode: $scope.settings.language,
      readOnly: 'nocursor',
      autoCloseBrackets: true
    };

    Bot.getAllBots().then(function(bots){
      $scope.bots = bots;
    });

    $scope.currentLevel = 1;

    $scope.playerBot = {
      name: 'lamkeewei',
      language: $scope.settings.language
    };

    $scope.computerBot = {
      name: 'lamkeewei',
      language: $scope.settings.language
    };

    $scope.playerBot.code = 'function getMove(boardStr) {\n  //Write your code here...\n  return boardStr;\n}';

    $scope.computerBot.code = 'function getMove(boardStr) {\n  //Write your code here...\n  return boardStr;\n}';

    $scope.$watch('settings.language', function(newVal, oldVal){
      $scope.botOptions.mode = newVal === 'java' ? 'clike' : newVal;
      $scope.playerOptions.mode = newVal === 'java' ? 'clike' : newVal;
      $scope.playerBot.language = newVal;
      $scope.computerBot.language = newVal;
    });

    $scope.saveBot = function(){
      // Bot.saveBot($scope.playerBot).then(function(data){
      //   console.log(data);
      // });
      console.log($scope.playerBot);
    };
  });
