'use strict';

describe('Service: Bot', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var Bot;
  beforeEach(inject(function (_Bot_) {
    Bot = _Bot_;
  }));

  it('should do something', function () {
    expect(!!Bot).toBe(true);
  });

});
