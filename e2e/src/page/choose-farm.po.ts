import { browser, $, $$, ElementFinder, ElementArrayFinder } from 'protractor';

export class ChooseFarmPage {
  readonly url = `${ browser.baseUrl }user/choose-farm`;

  public get element(): ElementFinder {
    return $('app-choose-farm-page');
  }

  public get title(): ElementFinder {
    return this.element.$('mat-toolbar .title');
  }

  public get listItems(): ElementArrayFinder {
    return this.element.$$('button[mat-list-item]');
  }

}