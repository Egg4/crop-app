Crop App
--------------------------

Crop App is a single page app built with [Angular](https://angular.io) and allowing the user to manage his vegetable crops.

See demo at [https://app.maraichage.org](https://app.maraichage.org)

**Crop list:** The user manages his crops by plant. Multi-plants crops and serial crops are allowed.

**Task oriented:** Like a todo list, the user logs the tasks (seeding, planting, harvesting) he performs on crops.

**Multi-farm:** A user can collaborate on several farms.

**Multi-user:** Multiple users can collaborate on the same farm.

**Multi-language:** The user can choose his UI language (English and French for now).

Docker
------
Docker image on [DockerHub](https://hub.docker.com/r/egg4/crop-app)

```
> docker pull egg4/crop-app
> docker run -tid -p 80:80 --name crop-app egg4/crop-app
```
Then open a browser on  _localhost_

Technical description
---------------------

[i18n](#i18n)

[Authentication](#authentication)

[Route guards](#guard)

[Reactive forms](#form)

[Validators](#validator)

[Animations](#animation)

[ORM Structure](#orm)

[Pipes](#pipe)

[Interceptors](#interceptor)

[Http cache](#cache)

[Error handling](#error)

[Unit tests](#unit-test)

[End 2 end tests](#e2e-test)


<a id="i18n"></a>

**i18n:** Runtime translation with ngx-translate module

```
/views/user/login-page/login-page.component.html

<mat-form-field>
  <mat-label>{{ 'login_page.email_label' | translate }}</mat-label>
  <input matInput type="email" placeholder="{{ 'login_page.email_placeholder' | translate }}" required>
</mat-form-field>
```

<a id="authentication"></a>

**Authentication:** Custom authentication set in http headers via an interceptor.

```
/interceptors/auth-interceptor.ts

if (toApi && !hasAuthToken && this.authentication.hasToken()) {
  const token = this.authentication.getToken();
  const newReq = req.clone({ setHeaders: { 'Auth-Token': token } });
  return next.handle(newReq);
}
```

<a id="guard"></a>

**Route guards:** Manage access rights to public pages and private pages

```
/views/user/user-routing-module.ts

const routes: Routes = [
  { path: 'login',  component: LoginPageComponent,  canActivate: [NotLoggedGuard] },
  { path: 'logout', component: LogoutPageComponent, canActivate: [LoggedGuard] }
];
```

```
/guards/logged-guard.ts

public canActivate(...) {
  if (this.authentication.hasToken()) {
    return true;
  }
  this.router.navigate(['/user/login']);
  return false;
}
```

<a id="form"></a>

**Reactive forms:** Complex reactive forms, dynamic nested reactive forms

```
/views/user/login-page/login-page.component.ts

public form = this.formBuilder.group({
  email:    ['', [ Validators.required, emailFormatValidator() ]],
  password: ['', [ Validators.required, passwordFormatValidator() ]],
});
```

```
/views/user/login-page/login-page.component.html

<mat-form-field>
  <mat-label>{{ 'login_page.email_label' | translate }}</mat-label>
  <input matInput type="email" formControlName="email" required>
  <button mat-button
    [disabled]="!email.value"
    matSuffix mat-icon-button (click)="email.setValue('')"
    type="button">
    <mat-icon>close</mat-icon>
  </button>
  <mat-error *ngIf="email.errors?.required">{{ 'login_page.email_required' | translate }}</mat-error>
  <mat-error *ngIf="email.errors?.invalid">{{ 'login_page.email_invalid' | translate }}</mat-error>
</mat-form-field>

<mat-form-field>
  <mat-label>{{ 'login_page.password_label' | translate }}</mat-label>
  <input matInput [type]="passwordVisible ? 'text' : 'password'" formControlName="password" required>
  <button mat-button
    mat-icon-button matSuffix (click)="passwordVisible = !passwordVisible" 
    type="button">
    <mat-icon>{{ passwordVisible ? 'visibility_off' : 'visibility' }}</mat-icon>
  </button>
  <mat-error *ngIf="password.errors?.required">{{ 'login_page.password_required' | translate }}</mat-error>
  <mat-error *ngIf="password.errors?.invalid">{{ 'login_page.password_invalid' | translate }}</mat-error>
</mat-form-field>

<button mat-raised-button
  type="submit"
  color="primary"
  [disabled]="!submittable">
  {{ 'login' | translate | uppercaseFirst }}&nbsp;<mat-icon>login</mat-icon>
</button>
```

<a id="validator"></a>

**Validators:** Built-in validators, custom validators, async validators and cross fields validators

```
/validators/password-format.validator.ts

export function passwordFormatValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    const match = control.value.length === 0 || pattern.test(control.value);
    return match ? null : { invalid: true };
  };
}
```

<a id="animation"></a>

**Animations:** Animated page transition, list item CRUD animation

```
/views/crop/crop-list-page/crop-list-page.component.html

<mat-action-list @listAnimation  *ngIf="crops$ | async as crops">
  <div @listItemAnimation *ngFor="let crop of crops">
    <app-crop-list-item [crop]="crop"></app-crop-list-item>
    <mat-divider></mat-divider>
  </div>
</mat-action-list>
```

```
/animations/list-item.animation.ts

export const listItemAnimation = trigger('listItemAnimation', [
  transition(':enter', [
    style({ transform: 'scale(0.9)', opacity: 0, height: '0px' }),
    animate('300ms cubic-bezier(0.8, -0.6, 0.2, 1.5)',
      style({ transform: 'scale(1)', opacity: 1, height: '*' })
    )
  ])
  ...
]);
```

<a id="orm"></a>

**ORM structure:** Models, factories, stores

<table>
<thead>
  <tr><th></th><th>Model</th><th>Factory</th><th>Store</th></tr>
</thead>
<tbody>
  <tr><td>Crop</td>      <td>X</td><td>X</td><td>X</td></tr>
  <tr><td>Farm</td>      <td>X</td><td>X</td><td>X</td></tr>
  <tr><td>Harvesting</td><td>X</td><td>X</td><td> </td></tr>
  <tr><td>Plant</td>     <td>X</td><td>X</td><td>X</td></tr>
  <tr><td>Planting</td>  <td>X</td><td>X</td><td> </td></tr>
  <tr><td>Seeding</td>   <td>X</td><td>X</td><td> </td></tr>
  <tr><td>Task</td>      <td>X</td><td>X</td><td>X</td></tr>
  <tr><td>User</td>      <td> </td><td> </td><td>X</td></tr>
  <tr><td>Variety</td>   <td>X</td><td>X</td><td>X</td></tr>
  <tr><td>Working</td>   <td>X</td><td>X</td><td> </td></tr>
</tbody>
</table>

<a id="pipe"></a>

**Pipes:** Built-in pipes, custom pipes

```
/pipes/upper-case-first.pipe.ts

export class UpperCaseFirstPipe implements PipeTransform {
  transform(value: string): string {
    if (!value.length) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
```

<a id="interceptor"></a>

**Interceptors:** Http headers, authentication, api error handler, http loader

```
/interceptors/loader-interceptor.ts

public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  this.loader.startLoading(req.url);
  return next.handle(req).pipe(
    tap(event => { if (event instanceof HttpResponse) this.loader.stopLoading(req.url); }),
    catchError(error => {
      this.loader.stopLoading(req.url);
      return throwError(error);
    })
  );
}
```

<a id="cache"></a>

**Http cache:** Advanced RxJs cache for observable http request

```
/stores/crop-store.service.ts

constructor(...) {
  this.cache.set<Crop[]>('crop.list',
  this.http.get<Crop[]>(`${ config.api.url }/crop`).pipe(
    map(crops => crops.map(crop => this.factory.create(crop)))
  ),
  { timeout: config.cache.timeout }
  );
}

public list(): Observable<Crop[]> {
  return this.cache.get<Crop[]>('crop.list');
}

...

public create(crop: Crop): Observable<Crop> {
  return this.http.post<Crop>(`${ config.api.url }/crop`, crop).pipe(
    map(crop => this.factory.create(crop)),
    tap(_ => this.cache.reset('crop.list'))
  );
}
```

<a id="error"></a>

**Error handling:** Global error handling

```
/app-module.ts

providers: [
  { provide: ErrorHandler, useClass: ErrorHandlerService }
]
```

```
/error/error-handler.service.ts

public handleError(error: Error): void {
  if (error.name === 'network_error') {
    this.openErrorDialog(error.name);
  }
  super.handleError(error);
}
```

<a id="unit-test"></a>

**Unit tests:** Assertions, httpmock requests and spies using Karma / Jasmine

```
/views/user/login-page/login-page-component.spec.ts

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
```


<a id="e2e-test"></a>

**End 2 end tests:** Using Protractor / Jasmine

```
../../e2e/src/login.e2e-spec.ts

it('should throw authentication failure', async () => {
  await browser.get(loginPage.url);
  await loginPage.setCredentials(config.user.email, 'BadPassword123');
  await loginPage.submitButton.click();
  expect(await loginPage.errors.first().getText()).toContain('Authentication failed');
});
```