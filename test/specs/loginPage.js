describe('franklin login page', function() {
  it('should be in the login page', function() {
    browser.get('http://localhost:3000');

    expect(browser.getTitle()).toEqual('franklin-dashboard');

    expect(element(by.id('franklin-login-button')).isPresent()).toBe(true);

    var button = element(by.id('franklin-login-button'));

    expect(button.getText()).toEqual('Login with GitHub');

  });  
});