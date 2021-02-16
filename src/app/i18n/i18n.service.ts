import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18n {
  private storage = localStorage;

  constructor() { }

  public getLanguage(): string {
    let language =  this.storage.getItem('language');
    if (!language) {
	  const browserLocales = !navigator.languages ? [navigator.language] : navigator.languages;
      language = browserLocales.length > 0 ? browserLocales[0].trim().split(/-|_/)[0] : 'en';
    }

    return language;
  }

  public setLanguage(language: string): void {
    this.storage.setItem('language', language);
  }

}