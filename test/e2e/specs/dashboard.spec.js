 'use strict';

 const dotENV = require('dotenv').load();

 var popUpHandle, handlePromise;
 popUpHandle = {};

 describe('main dashboard', function() {

   // LOGIN - Assuming the login test already run 
   // and github information is cached
   beforeEach(function() {
     browser.get('/');
     //load app and click on github login button
     browser.findElement(protractor.By.id('login-button')).click();
     //wait login to be performed
     browser.sleep(500);
   });

   it('dashboard test', function() {
     expect(browser.getTitle()).toEqual('franklin-dashboard');
     
   });

   afterEach(function() {
     //clean localStorage - logout
     browser.executeScript('window.sessionStorage.clear();');
     browser.executeScript('window.localStorage.clear();');
   });

 });
