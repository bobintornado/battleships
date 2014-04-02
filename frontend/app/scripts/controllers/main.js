'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, Board, Bot, $http, $q) {
    $scope.settings = {
      language: 'python',
      hasWon: false,
      isOver: false,
      initialCall: true,
      gameStart: false,
      hasError: false,
      errorMsg: ''
    };

    // Define 'global' game variable 
    $scope.history = {};
    $scope.history.player = [];
    $scope.history.computer = [];

    $scope.board = {};
    
    $scope.playerBot = {
      name: 'lamkeewei',
      language: $scope.settings.language,
      solution: Bot.getSample($scope.settings.language)
    };

    $scope.computerBot = {
      name: 'lamkeewei',
      language: $scope.settings.language,
      solution: Bot.getSample($scope.settings.language)
    };

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
      var playerRequest = {
        language: $scope.settings.language,
        solution: $scope.playerBot.solution,
        // board: $scope.serializeBoard($scope.computerBot.board)
        board: '-s-'
      };

      var computerRequest = {
        language: $scope.settings.language,
        solution: $scope.computerBot.solution,
        // board: $scope.serializeBoard($scope.playerBot.board)
        board: '-s-'
      };

      // Make calls to backend to get new board
      $q.all([
        $http.post('Game/getNewBoard', computerRequest),
        $http.post('Game/getNewBoard', playerRequest)
      ]).then(function(res){
        var computerData = res[0].data;
        var playerData = res[1].data;

        if(computerData.status === 'error' && playerData.status === 'error'){
          $scope.settings.hasError = true;
          $scope.settings.errorMsg = playerData.message;

          console.log(computerData.errors);
          console.log(playerData.errors);
          return false;
        }

        $scope.computerBot.board = $scope.parseBoard(computerData.newBoard);
        $scope.playerBot.board = $scope.parseBoard(playerData.newBoard);

        $scope.history.computer.push($scope.computerBot.board);
        $scope.history.player.push($scope.playerBot.board);

        $scope.playGame();
      });
    };
  });
