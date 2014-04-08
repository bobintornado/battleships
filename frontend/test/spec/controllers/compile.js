'use strict';

describe('Controller: CompileCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var CompileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompileCtrl = $controller('CompileCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
