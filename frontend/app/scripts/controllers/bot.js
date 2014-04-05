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

    $scope.$watch('settings.language', function(newVal, oldVal){
      if(oldVal !== newVal){
        console.log('chagned');
        $scope.botOptions.mode = newVal === 'java' ? 'clike' : newVal;
        $scope.playerOptions.mode = newVal === 'java' ? 'clike' : newVal;
        $scope.playerBot.language = newVal;
        $scope.playerBot.solution = $scope.initPlayerSolution();
        $scope.computerBot.language = newVal;
        $scope.computerBot.solution = Bot.getSample(newVal);        
      }
    });

    $scope.saveBot = function(){
      // Bot.saveBot($scope.playerBot).then(function(data){
      //   console.log(data);
      // });
      console.log($scope.botOptions.mode);
    };
  });
