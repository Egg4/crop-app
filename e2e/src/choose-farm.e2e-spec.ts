import { browser } from 'protractor';

import { AppPage } from './page/app.po';
import { LoginPage } from './page/login.po';
import { ChooseFarmPage } from './page/choose-farm.po';
import { CropListPage } from './page/crop-list.po';

import { config } from '../config';

describe('Choose farm', () => {
  const EC = browser.ExpectedConditions;
  let appPage = new AppPage();
  let loginPage = new LoginPage();
  let chooseFarmPage = new ChooseFarmPage();
  let cropListPage = new CropListPage();

  beforeAll(async () => {
	await browser.get(loginPage.url);
    await loginPage.setCredentials(config.user.email, config.user.password);
    await loginPage.submitButton.click();
    await browser.wait(EC.urlIs(chooseFarmPage.url));
  });

  afterAll(async () => {
    await appPage.logout();
  });

  it('should redirect to crops page', async () => {	
	browser.waitForAngularEnabled(false);

    await chooseFarmPage.listItems.first().click();
    await browser.wait(EC.urlIs(cropListPage.url));
    expect(await browser.getCurrentUrl()).toEqual(cropListPage.url);
    expect(await cropListPage.title.getText()).toEqual('Crops');

    browser.waitForAngularEnabled(true);
  });

});