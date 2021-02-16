import { browser, $, $$, ElementFinder, ElementArrayFinder } from 'protractor';

export class LoginPage {
  readonly url = `${ browser.baseUrl }user/login`;

  public get element(): ElementFinder {
    return $('app-login-page');
  }

  public get title(): ElementFinder {
    return this.element.$('mat-toolbar .title');
  }

  public get errors(): ElementArrayFinder {
    return this.element.$$('mat-error');
  }

  public get emailInput(): ElementFinder {
    return this.element.$('input[formControlName="email"]');
  }

  public get passwordInput(): ElementFinder {
    return this.element.$('input[formControlName="password"]');
  }

  public get submitButton(): ElementFinder {
    return this.element.$('button[type="submit"]');
  }

  public async setCredentials(email: string, password: string) {
	return Promise.all([
      this.emailInput.sendKeys(email),
      this.passwordInput.sendKeys(password),
	]);
  }

}