'use strict';

describe('Controller: BoardCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var BoardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BoardCtrl = $controller('BoardCtrl', {
      $scope: scope
    });
  }));

  it('isShip to return true when the value is "s" and the gameStart is true', function () {
    scope.settings = {
      gameStart: true
    };
    var val = 's';
    expect(scope.isShip(val)).toBe(true);
  });

  it('isShip should not return true when the value is "s" and but gameStart is false', function () {
    scope.settings = {
      gameStart: false
    };
    var val = 's';
    expect(scope.isShip(val)).toBe(false);
  });

  it('isShip should not return true when the value is not "s" and gameStart is false', function () {
    scope.settings = {
      gameStart: false
    };
    var val = 'x';
    expect(scope.isShip(val)).toBe(false);
  });

  it('isMiss to return true when the value is "m"', function () {
    var val = 'm';
    expect(scope.isMiss(val)).toBe(true);
  });

  it('isMiss should not return true when the value is not "m"', function () {
    var val = 'h';
    expect(scope.isMiss(val)).toBe(false);
  });

  it('isHit to return true when the value is "h"', function () {
    var val = 'h';
    expect(scope.isHit(val)).toBe(true);
  });

  it('isHit should not return true when the value is not "h"', function () {
    var val = 'm';
    expect(scope.isHit(val)).toBe(false);
  });
});
