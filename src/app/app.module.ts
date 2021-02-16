import { BrowserModule, Title, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
}

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { WidgetsModule } from './widgets/widgets.module';
import { UserModule } from './views/user/user.module';
import { CropModule } from './views/crop/crop.module';
import { TaskModule } from './views/task/task.module';
import { VarietyModule } from './views/variety/variety.module';

import 'hammerjs';
import { ErrorHandlerService } from './error/error-handler.service';
import { interceptorProviders } from './interceptors/providers';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HammerModule,
    BrowserAnimationsModule,
	HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
	AppRoutingModule,
	SharedModule,
	WidgetsModule,
	UserModule,
	CropModule,
	TaskModule,
	VarietyModule,
  ],
  providers: [
	Title,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
	interceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
