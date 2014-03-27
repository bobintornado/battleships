'use strict';

angular.module('frontendApp')
  .factory('Board', function ($http, $q) {
    return {
      initializeBoards: function () {
        var boards = $q.defer();

        $http.get('Board/initialize').then(function(res){
          boards.resolve(res.data);
        });

        return boards.promise;
      }
    };
  });
