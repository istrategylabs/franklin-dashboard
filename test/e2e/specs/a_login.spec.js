'use strict';

const dotENV = require('dotenv').load();

var popUpHandle, handlePromise;
popUpHandle = {};


describe('login implementation and redirection', function() {

  it('should be in the login page if not logged in', function() {

    browser.get('/');
    
    expect(browser.getTitle()).toEqual('franklin-dashboard');
    expect(element(by.id('login-button')).isPresent()).toBe(true);

    var button = element(by.id('login-button'));
    expect(button.getText()).toEqual('Login with GitHub');

  });

  it('should redirect to login page if not logged in', function() {

    browser.get('/#/otherpage');

    expect(browser.getTitle()).toEqual('franklin-dashboard');
    expect(element(by.id('login-button')).isPresent()).toBe(true);

    var button = element(by.id('login-button'));
    expect(button.getText()).toEqual('Login with GitHub');

  });

  it('should redirect to dashboard page after logging in', function() {

    browser.get('/');

    //load app and click on github login button
    browser.findElement(protractor.By.id('login-button')).click();

    //change to github popup window to login
    handlePromise = browser.getAllWindowHandles();
    var handles = handlePromise.then(function(handles) {
      popUpHandle = handles[1];
      var handle = browser.switchTo().window(popUpHandle);
      handle = browser.getWindowHandle();
      expect(handle).toEqual(popUpHandle);
      browser.driver.executeScript('window.focus();');

      //login to github on pop up window
      browser.driver.findElement(by.id('login_field')).sendKeys(process.env.TEST_USER);
      browser.driver.findElement(by.id('password')).sendKeys(process.env.TEST_PASS);
      browser.driver.findElement(by.css('input[type=submit]')).click();

      //wait login to be performed
      browser.sleep(500);

      //get and focus on main window with dashboard page
      handlePromise = browser.getAllWindowHandles();
      handles = handlePromise.then(function(handles) {
        popUpHandle = handles[0];
        var handle = browser.switchTo().window(popUpHandle);
        handle = browser.getWindowHandle();
        expect(handle).toEqual(popUpHandle);
        browser.driver.executeScript('window.focus();');

        //wait for angular to load
        browser.waitForAngular();

        //check the dashboard page is loaded            
        browser.getCurrentUrl().then(function(actualUrl) {
          expect(actualUrl).toBe(process.env.BASE_URL + '/#/dashboard');
        });
      });
    });
  });

  afterEach(function() {
    //clean localStorage - logout
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });


});
