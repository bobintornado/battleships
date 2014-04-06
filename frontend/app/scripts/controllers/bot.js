'use strict';

angular.module('frontendApp')
  .controller('BotCtrl', function ($scope, Bot, filterFilter) {
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
        var lang = newVal;

        if(lang === 'java'){
          lang = 'clike';
        } else if (lang === 'js'){
          lang = 'javascript';
        }

        $scope.settings.selectedBot = filterFilter($scope.percentileBots, {language: newVal});
        if($scope.settings.selectedBot.length > 0){
          $scope.settings.selectedBot = $scope.settings.selectedBot[0].name;
        } else {
          $scope.computerBot.solution = Bot.getSample(newVal);
        }

        $scope.botOptions.mode = lang;
        $scope.playerOptions.mode = lang;
        $scope.playerBot.language = newVal;
        $scope.playerBot.solution = $scope.initPlayerSolution();
        $scope.computerBot.language = newVal;
      }
    });

    $scope.saveBot = function(){
      // Bot.saveBot($scope.playerBot).then(function(data){
      //   console.log(data);
      // });
      console.log($scope.botOptions.mode);
    };
  });
