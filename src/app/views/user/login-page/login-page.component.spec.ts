import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { throwError, of } from 'rxjs';

import { SharedModule } from '../../../shared/shared.module';
import { LoginPageComponent } from './login-page.component';
import { UserStore } from '../../../stores/user-store.service';

describe('LoginPageComponent (with spy)', () => {
  let router: any;
  let userStore: any;

  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
	router = jasmine.createSpyObj('Router', ['navigate']);
	userStore = jasmine.createSpyObj('UserStore', ['login']);

    await TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent,
      ],
      imports: [
	    BrowserAnimationsModule,
        TranslateModule.forRoot(),
        SharedModule,
      ],
      providers: [
	    { provide: Router, useValue: router },
        { provide: UserStore, useValue: userStore },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    rootElement = fixture.nativeElement;
  });

  it('should throw email & password required', () => {
	fixture.detectChanges();
	component.form.markAllAsTouched();
	component.form.setValue({ language: 'en', email: '', password: '' });
    fixture.detectChanges();

	const emailMatError = rootElement.querySelector<HTMLElement>('mat-form-field.email mat-error');
	expect(emailMatError.textContent).toBe('login_page.email_required');
	const passwordMatError = rootElement.querySelector<HTMLElement>('mat-form-field.password mat-error');
	expect(passwordMatError.textContent).toBe('login_page.password_required');
  });

  it('should throw email & password invalid', () => {
	fixture.detectChanges();
	component.form.markAllAsTouched();
	component.form.setValue({ language: 'en', email: 'invalid_email', password: 'invalid_password' });
    fixture.detectChanges();

	const emailMatError = rootElement.querySelector<HTMLElement>('mat-form-field.email mat-error');
	expect(emailMatError.textContent).toBe('login_page.email_invalid');
	const passwordMatError = rootElement.querySelector<HTMLElement>('mat-form-field.password mat-error');
	expect(passwordMatError.textContent).toBe('login_page.password_invalid');
  });

  it('should login succeed', () => {
	const userStoreLoginSpy = userStore.login.and.returnValue(of(undefined));
	fixture.detectChanges();
	component.form.markAllAsTouched();
    component.form.markAsDirty();
	component.form.setValue({ language: 'en', email: 'valid_email@email.com', password: 'ValidPassword1' });
    fixture.detectChanges();

	const submitButton = rootElement.querySelector<HTMLInputElement>('button[type="submit"]');
    submitButton.click();
    fixture.detectChanges();

	expect(userStoreLoginSpy).toHaveBeenCalledWith({ email: component.email.value, password: component.password.value });
	expect(router.navigate).toHaveBeenCalledWith(['/user/choose-farm']);
  });

  it('should login throw authentication failure', () => {
	const error: Error = { name: 'authentication_failure', message: '' };
	const userStoreLoginSpy = userStore.login.and.returnValue(throwError(error));
	fixture.detectChanges();
	component.form.markAllAsTouched();
    component.form.markAsDirty();
	component.form.setValue({ language: 'en', email: 'valid_email@email.com', password: 'ValidPassword1' });
    fixture.detectChanges();

	const submitButton = rootElement.querySelector<HTMLInputElement>('button[type="submit"]');
    submitButton.click();
    fixture.detectChanges();

    expect(userStoreLoginSpy).toHaveBeenCalledWith({ email: component.email.value, password: component.password.value });
	const matError = rootElement.querySelector<HTMLElement>('mat-error');
	expect(matError.textContent).toContain('login_page.authentication_failure');
  });

});