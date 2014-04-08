'use strict';

angular.module('frontendApp')
  .controller('CompileCtrl', function ($scope, errorMsg) {
    $scope.errorMsg = errorMsg;
  });
