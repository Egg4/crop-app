import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { I18n } from '../../../i18n/i18n.service';
import { config } from '../../../config/config';
import { UserStore } from '../../../stores/user-store.service';
import { emailFormatValidator } from '../../../validators/email-format.validator';
import { passwordFormatValidator } from '../../../validators/password-format.validator';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  private submitted: boolean = false;
  public submittable: boolean;
  public passwordVisible: boolean;
  public languages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
  ];

  public form = this.formBuilder.group({
	language: ['', [
	  Validators.required,
	]],
    email: ['', [
	  Validators.required,
	  emailFormatValidator(),
	]],
    password: ['', [
	  Validators.required,
      passwordFormatValidator(),
	]],
  });

  constructor(
	private router: Router,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private i18n: I18n,
    private userStore: UserStore,
  ) { }

  public ngOnInit(): void {
	const language = this.translate.currentLang;
	this.form.get('language').setValue(language);
    this.form.valueChanges.subscribe(
      _ => this.submittable = this.isSubmittable()
    );
  }

  public get language(): AbstractControl {
    return this.form.get('language');
  }

  public get email(): AbstractControl {
    return this.form.get('email');
  }

  public get password(): AbstractControl {
    return this.form.get('password');
  }

  public isSubmittable(): boolean {
    return !this.submitted && this.form.valid && this.form.dirty;
  }

  public onSubmit(): void {
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;
	this.submit(email, password);
  }

  public onChangeLanguage(): void {
    const language = this.form.get('language').value;
    this.translate.use(language);
    this.i18n.setLanguage(language);
  }

  public onClickDemo(): void {
    this.submit(config.demo.email, config.demo.password);
  }

  private submit(email: string, password: string): void {
	this.submitted = true;
    this.userStore.login({ email: email, password: password }).pipe(
      tap(_ => this.router.navigate(['/user/choose-farm'])),
      catchError((error: Error) => {
	    this.submitted = false;
	    if (error && (error.name === 'authentication_failure' || error.name === 'invalid_content')) {
          this.form.setErrors({ authentication_failure: true });
          return of(undefined);
	    }
	    return throwError(error);
      })
    ).subscribe();
  }

}