'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, Board, Bot, $http, $q, localStorageService, $modal, allBots, filterFilter, $firebase, $firebaseSimpleLogin, Firebase, $rootScope) {
    $modal.open({
      templateUrl: 'views/help.html'
    });

    var dataRef = new Firebase('https://battleships-is306.firebaseio.com/');
    $scope.loginObj = $firebaseSimpleLogin(dataRef);
    $scope.isLogin = false;

    $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
      $scope.isLogin = true;
    });

    $rootScope.$on('$firebaseSimpleLogin:logout', function(e, user) {
      $scope.isLogin = false;
    });

    $scope.percentileBots = allBots;
    $scope.allBots = allBots;

    $scope.getMaxScore = function(){
      var max = 0;
      $scope.allBots.forEach(function(d){
        var score = d.score;
        if(max < score){
          max = score;
        }
      });

      return max.toFixed(2);
    };

    $scope.maxScore = $scope.getMaxScore();

    $scope.settings = {
      language: 'python',
      hasWon: false,
      isOver: false,
      initialCall: true,
      gameStart: false,
      hasError: false,
      errorMsg: '',
      selectedBot: ''
    };

    // TODO: Refactor when have time
    $scope.settings.selectedBot = filterFilter($scope.percentileBots, {language: $scope.settings.language});
    if($scope.settings.selectedBot.length > 0){
      $scope.settings.selectedBot = $scope.settings.selectedBot[0].name;
    }
    // Define 'global' game variable 
    $scope.history = {};
    $scope.history.player = [];
    $scope.history.computer = [];

    $scope.board = {};
    
    $scope.initPlayerSolution = function(){
      var playerSol = localStorageService.get('playerSolution_' + $scope.settings.language);
      
      if(null === playerSol){
        playerSol = Bot.getSample($scope.settings.language);
      }
      return playerSol;
    };

    $scope.playerBot = {
      name: 'lamkeewei',
      language: $scope.settings.language,
      solution: $scope.initPlayerSolution()
    };

    $scope.computerBot = {
      name: 'lamkeewei',
      language: $scope.settings.language,
      solution: Bot.getSample($scope.settings.language)
    };

    $scope.$watch('playerBot.solution', function(newVal, oldVal){
      localStorageService.add('playerSolution_' + $scope.settings.language, newVal);
    });

    $scope.parseBoard = function(boardStr){
      var output = [];
      var rows = boardStr.split('|');

      rows.forEach(function(el){
        var row = [];

        el.split('').forEach(function(cell){
          cell = cell === '-' ? '' : cell;
          row.push(cell);
        });

        output.push(row);
      });

      return output;
    };

    $scope.getBot = function(name){
      var selected = {};

      $scope.percentileBots.forEach(function(bot){
        if(bot.name === name){
          selected = bot;
        }
      });

      return selected;
    };

    $scope.$watch('settings.selectedBot', function(newVal, oldVal){
      // TODO: Refactor when have time
      var selected = filterFilter($scope.percentileBots, {language: $scope.settings.language});
      if(selected.length > 0){
        $scope.computerBot.solution = $scope.getBot(newVal).code;
      }
    });

    $scope.currentLevel = 1;
    var emptyBoard = '-------|-------|-------|-------|-------|-------|-------';
    $scope.playerBot.board = $scope.parseBoard(emptyBoard);
    $scope.computerBot.board = $scope.parseBoard(emptyBoard);

    $scope.hasWon = function(){
      return $scope.settings.hasWon && !$scope.settings.initialCall && $scope.settings.isOver;
    };

    $scope.hasLost = function(){
      return !$scope.settings.hasWon && !$scope.settings.initialCall && $scope.settings.isOver;
    };

    $scope.serializeBoard = function(board){
      var serialize = '';

      board.forEach(function(row){
        row.forEach(function(d){
          d = d === '' ? '-' : d;
          serialize += d;
        });

        serialize += '|';
      });

      serialize = serialize.substring(0, serialize.length - 1);
      return serialize;
    };

    $scope.startGame = function(){
      Board.initializeBoards().then(function(data){
        $scope.playerBot.board = $scope.parseBoard(data.player);
        $scope.computerBot.board = $scope.parseBoard(data.bot);
        // console.log(data.bot);
        // console.log(data.player);
        // $scope.playerBot.board = $scope.parseBoard('-s-');
        // $scope.computerBot.board = $scope.parseBoard('-s-');

        $scope.settings.hasWon = false;
        $scope.settings.isOver = false;
        $scope.settings.initialCall = false;
        $scope.settings.hasError = false;
        $scope.settings.errorMsg = '';
        $scope.settings.gameStart = true;

        $scope.history = {};
        $scope.history.player = [];
        $scope.history.computer = [];

        $scope.playGame();
      });
    };

    $scope.playGame = function(){
      // Craft request objects
      var lang = $scope.settings.language;

      var playerRequest = {
        language: lang,
        solution: $scope.playerBot.solution,
        board: $scope.serializeBoard($scope.computerBot.board)
        // board: '-s-'
      };

      var computerRequest = {
        language: lang,
        solution: $scope.computerBot.solution,
        board: $scope.serializeBoard($scope.playerBot.board)
        // board: '-s-'
      };

      // Make calls to backend to get new board
      $q.all([
        $http.post('Game/getNewBoard', computerRequest),
        $http.post('Game/getNewBoard', playerRequest)
      ]).then(function(res){
        var computerData = res[0].data;
        var playerData = res[1].data;

        if(!computerData || !playerData){
          $scope.settings.hasError = true;
          $scope.settings.errorMsg = 'Service is busy at the moment!';
          $scope.settings.feedback = 'Please try again later!';
          return false;
        }

        if(computerData.status === 'error' || playerData.status === 'error'){
          $scope.settings.hasError = true;
          $scope.settings.errorMsg = playerData.message;
          $scope.settings.feedback = 'Method output: ' + playerData.generateStr;
          $scope.settings.compileError = playerData.errors;

          return false;
        }

        $scope.computerBot.board = $scope.parseBoard(playerData.newBoard);
        
        $scope.playerBot.board = $scope.parseBoard(computerData.newBoard);

        $scope.settings.playerString = playerData.generateStr;
        $scope.history.computer.push($scope.computerBot.board);
        $scope.history.player.push($scope.playerBot.board);

        if(playerData.winningStatus || computerData.winningStatus){
          $scope.settings.gameStart = false;
          if(playerData.winningStatus){
            $scope.settings.hasWon = true;
          }

          var result;
          if (playerData.winningStatus === computerData.winningStatus){
            // Draw
            result = 1;
          } else if (playerData.winningStatus) {
            // Player win
            result = 0;
          } else {
            // Computer win
            result = 2;
          }
          console.log(computerData);
          console.log(playerData);

          var updateResult = {
            name1: playerData.bot.name,
            name2: computerData.bot.name,
            result: result
          };

          $http.post('/Game/addResult', updateResult).success(function(data){
            console.log(data);
            $scope.settings.isOver = true;
          });

          return false;
        }

        $scope.playGame();
      });
    };

    $scope.reset = function(){
      $scope.settings.hasWon = false;
      $scope.settings.isOver = false;
      $scope.settings.initialCall = true;
      $scope.settings.hasError = false;
      $scope.settings.errorMsg = '';

      var emptyBoard = '-------|-------|-------|-------|-------|-------|-------';
      $scope.playerBot.board = $scope.parseBoard(emptyBoard);
      $scope.computerBot.board = $scope.parseBoard(emptyBoard);
    };

    $scope.showCompileError = function(){
      console.log('error');
      $modal.open({
        templateUrl: 'views/compile.html',
        controller: 'CompileCtrl',
        resolve: {
          errorMsg: function(){
            return $scope.settings.compileError;
          }
        }
      });
    };

    $scope.viewHistory = function(){
      $scope.settings.hasWon = false;
      $scope.settings.isOver = false;
      $scope.settings.initialCall = true;
      $scope.settings.hasError = false;
      $scope.settings.errorMsg = '';

      var emptyBoard = '-------|-------|-------|-------|-------|-------|-------';
      $scope.playerBot.board = $scope.parseBoard(emptyBoard);
      $scope.computerBot.board = $scope.parseBoard(emptyBoard);

      $modal.open({
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl',
        resolve: {
          history: function(){
            return $scope.history.player;
          }
        }
      });
    };
  });
