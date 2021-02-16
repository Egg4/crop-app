import { browser, logging } from 'protractor';

import { AppPage } from './page/app.po';
import { LoginPage } from './page/login.po';
import { ChooseFarmPage } from './page/choose-farm.po';

import { config } from '../config';

describe('Login', () => {
  const EC = browser.ExpectedConditions;
  let appPage = new AppPage();
  let loginPage = new LoginPage();
  let chooseFarmPage = new ChooseFarmPage();

  afterAll(async () => {
    await appPage.logout();
  });

  it('should throw authentication failure', async () => {
    await browser.get(loginPage.url);
    await loginPage.setCredentials(config.user.email, 'BadPassword123');
    await loginPage.submitButton.click();
    expect(await loginPage.errors.first().getText()).toContain('Authentication failed');
  });

  it('should redirect to choose farm page', async () => {	
    await browser.get(loginPage.url);
    await loginPage.setCredentials(config.user.email, config.user.password);
    await loginPage.submitButton.click();
    await browser.wait(EC.urlIs(chooseFarmPage.url));
    expect(await chooseFarmPage.title.getText()).toEqual('Farms');
  });

/*
  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
*/

});