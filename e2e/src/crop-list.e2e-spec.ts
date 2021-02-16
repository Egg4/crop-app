import { browser } from 'protractor';

import { Crop } from '../../src/app/models/crop.model';
import { AppPage } from './page/app.po';
import { LoginPage } from './page/login.po';
import { ChooseFarmPage } from './page/choose-farm.po';
import { CropListPage } from './page/crop-list.po';
import { CropFormDialog } from './page/crop-form.po';

import { config } from '../config';

describe('Crop list', () => {
  const EC = browser.ExpectedConditions;
  let appPage = new AppPage();
  let loginPage = new LoginPage();
  let chooseFarmPage = new ChooseFarmPage();
  let cropListPage = new CropListPage();
  let cropFormDialog = new CropFormDialog();

  beforeAll(async () => {
    await browser.get(loginPage.url);
    await loginPage.setCredentials(config.user.email, config.user.password);
    await loginPage.submitButton.click();
    await browser.wait(EC.urlIs(chooseFarmPage.url));
    await chooseFarmPage.listItems.first().click();
    await browser.wait(EC.urlIs(cropListPage.url));
  });

  afterAll(async () => {
    await appPage.logout();
  });

  it('should cancel creating crop', async () => {
    browser.waitForAngularEnabled(false);

    await browser.wait(EC.elementToBeClickable(cropListPage.addButton));
    await cropListPage.addButton.click();
    await browser.wait(EC.visibilityOf(cropFormDialog.element));
    expect(await cropFormDialog.title.getText()).toEqual('Create crop');
    await cropFormDialog.backButton.click();
    await browser.wait(EC.invisibilityOf(cropFormDialog.element));

    browser.waitForAngularEnabled(true);
  });

  it('should create crop', async () => {
    browser.waitForAngularEnabled(false);

    await browser.wait(EC.elementToBeClickable(cropListPage.addButton));
    await cropListPage.addButton.click();
    await browser.wait(EC.visibilityOf(cropFormDialog.element));
    await cropFormDialog.populate({
      plant_ids: [1, 5],
      number: 2,
      mode: 'plant_purchasing',
    } as Crop);
    await browser.wait(EC.elementToBeClickable(cropFormDialog.submitButton));
    await cropFormDialog.submitButton.click();
    const firstItem = cropListPage.listItems.get(0);
    await browser.wait(EC.textToBePresentInElement(firstItem, 'Aneth Carotte 2'));
    expect(await firstItem.getText()).toContain('Aneth Carotte 2');

    browser.waitForAngularEnabled(true);
  });

/*
  it('should update crop', async () => {
    browser.waitForAngularEnabled(false);
    const firstItem = cropListPage.listItems.get(0);
    await browser.wait(EC.textToBePresentInElement(firstItem, 'Aneth Carotte 2'));
    await browser.touchActions().longPress(firstItem).perform();
    await browser.wait(EC.elementToBeClickable(cropListPage.editButton));
    await cropListPage.editButton.click();
    await browser.wait(EC.visibilityOf(cropFormDialog.element));
    await cropFormDialog.populate({
      plant_ids: [5, 6],
      number: 3,
      mode: 'plant_purchasing',
    } as Crop);
    await browser.wait(EC.elementToBeClickable(cropFormDialog.submitButton));
    await cropFormDialog.submitButton.click();
    await browser.wait(EC.textToBePresentInElement(firstItem, 'Carotte Fenouil 3'));
    expect(await firstItem.getText()).toContain('Carotte Fenouil 3');

    browser.waitForAngularEnabled(true);
  });
*/

});