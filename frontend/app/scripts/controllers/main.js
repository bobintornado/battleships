'use strict';

angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, Board, Bot, $http, $q) {
    $scope.settings = {
      language: 'javascript',
      hasWon: false,
      initialCall: true
    };

    // Define 'global' game variable 
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

    $scope.currentLevel = 1;

    Board.initializeBoards().then(function(data){
      $scope.playerBot.board = $scope.parseBoard(data.player);
      $scope.computerBot.board = $scope.parseBoard(data.bot);
    });

    $scope.hasWon = function(){
      return $scope.settings.hasWon && !$scope.settings.initialCall;
    };

    $scope.hasLost = function(){
      return !$scope.settings.hasWon && !$scope.settings.initialCall;
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

    $scope.playGame = function(){
      // Craft request objects
      var playerRequest = {
        'language': $scope.settings.language,
        'solution': $scope.playerBot.solution,
        'board': $scope.serializeBoard($scope.playerBot.board)
      };

      var computerRequest = {
        'language': $scope.settings.language,
        'solution': $scope.computerBot.solution,
        'board': $scope.serializeBoard($scope.computerBot.board)
      };

      // Change initiaCall value to false
      $scope.settings.initialCall = false;

      // Make calls to backend to get new board
      $q.all([
        $http.post('Game/getNewBoard', playerRequest),
        $http.post('Game/getNewBoard', computerRequest)
      ]).then(function(res){
        console.log(res);
      });
    };
  });
