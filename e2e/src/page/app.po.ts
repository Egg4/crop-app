import { browser, $, ElementFinder } from 'protractor';

export class AppPage {

  public get element(): ElementFinder {
    return $('app-root');
  }

  public async logout() {
    return browser.get(`${ browser.baseUrl }user/logout`);
  }

}