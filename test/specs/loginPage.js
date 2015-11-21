'use strict';

describe('franklin login page', function() {

  //TODO: check if the user is logged
  it('should be in the login page', function() {
    browser.get('http://localhost:3000');

    expect(browser.getTitle()).toEqual('franklin-dashboard');

    expect(element(by.id('franklin-login-button')).isPresent()).toBe(true);

    var button = element(by.id('franklin-login-button'));

    expect(button.getText()).toEqual('Login with GitHub');

  });

  //TODO: check if the user is logged
  it('should redirect to login page', function() {
    browser.get('http://localhost:3000/#/otherpage');

    expect(browser.getTitle()).toEqual('franklin-dashboard');

    expect(element(by.id('franklin-login-button')).isPresent()).toBe(true);

    var button = element(by.id('franklin-login-button'));

    expect(button.getText()).toEqual('Login with GitHub');

  });
});
