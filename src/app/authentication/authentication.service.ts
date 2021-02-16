import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  private storage = localStorage;

  constructor() { }

  public getToken(): string {
    return this.storage.getItem('token');
  }

  public setToken(token: string): void {
    this.storage.setItem('token', token);
  }

  public removeToken(): void {
    this.storage.removeItem('token');
  }

  public hasToken(): boolean {
    return (this.getToken() !== null);
  }

  public isFarmChosen(): boolean {
    return (this.storage.getItem('farm-chosen') === 'true');
  }

  public setFarmChosen(): void {
    this.storage.setItem('farm-chosen', 'true');
  }

  public removeFarmChosen(): void {
    this.storage.removeItem('farm-chosen');
  }

}
