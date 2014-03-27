'use strict';

angular.module('frontendApp')
  .controller('BotCtrl', function ($scope, Bot) {
    var getSample = function(language){
      switch(language){
        case 'javascript':
          return 'function getMove(boardStr) {\n  //Write your code here...\n  return boardStr;\n}';
        case 'java':
          return 'public static void getMove(String boardStr){\n  //Write your code here...\n  return boardStr;\n}';
        case 'python':
          return 'def getMove(boardStr):\n  //Write your code here\n  return boardStr';
      }
    };

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
      language: $scope.settings.language,
      code: getSample($scope.settings.language)
    };

    $scope.computerBot = {
      name: 'lamkeewei',
      language: $scope.settings.language,
      code: getSample($scope.settings.language)
    };

    $scope.$watch('settings.language', function(newVal, oldVal){
      $scope.botOptions.mode = newVal === 'java' ? 'clike' : newVal;
      $scope.playerOptions.mode = newVal === 'java' ? 'clike' : newVal;
      $scope.playerBot.language = newVal;
      $scope.playerBot.code = getSample(newVal);
      $scope.computerBot.language = newVal;
    });

    $scope.saveBot = function(){
      // Bot.saveBot($scope.playerBot).then(function(data){
      //   console.log(data);
      // });
      console.log($scope.botOptions.mode);
    };
  });
