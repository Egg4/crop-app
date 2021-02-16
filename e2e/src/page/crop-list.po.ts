import { browser, $, $$, ElementFinder, ElementArrayFinder } from 'protractor';

export class CropListPage {
  readonly url = `${ browser.baseUrl }crop`;

  public get element(): ElementFinder {
    return $('app-crop-list-page');
  }

  public get title(): ElementFinder {
    return this.element.$('mat-toolbar .title');
  }

  public get listItems(): ElementArrayFinder {
    return this.element.$$('button[mat-list-item]');
  }

  public get addButton(): ElementFinder {
    return this.element.$('button.fixed-add-fab-button');
  }

  public get bottonSheet(): ElementFinder {
    return $('app-crop-lis-action-sheet');
  }

  public get editButton(): ElementFinder {
    return this.bottonSheet.$$('button').get(0);
  }

  public get deleteButton(): ElementFinder {
    return this.bottonSheet.$$('button').get(1);
  }

}