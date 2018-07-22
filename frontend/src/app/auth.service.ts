import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { User } from './user';


@Injectable()
export class AuthService {
  private authUrl = '/api/web/';
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {
    const url = `${this.authUrl}user/`;
    this.http.get<User>(url)
      .subscribe(user => {
        this._user.next(user);
      });
  }

  get user() {
    return this._user.asObservable();
  }

  userUpdate(payload: {string: string}) {
    const url = `${this.authUrl}user/`;
    return this.http.put<User>(url, payload)
      .do(user => {
        this._user.next(user);
      });
  }

  passwordChange(payload: {string: string}) {
    const url = `${this.authUrl}password/change/`;
    return this.http.post<any>(url, payload);
  }

  login(payload: {string: string}) {
    const url = `${this.authUrl}login/`;
    return this.http.post<User>(url, payload)
      .do(user => {
        this._user.next(user);
      });
  }

  logout() {
    const url = `${this.authUrl}logout/`;
    return this.http.post(url, {})
      .do(res => {
        this._user.next(null);
      });
  }

  passwordReset(payload: {string: string}) {
    const url = `${this.authUrl}password/reset/`;
    return this.http.post(url, payload);
  }

  passwordResetConfirm(payload: {string: string}) {
    const url = `${this.authUrl}password/reset/confirm/`;
    return this.http.post(url, payload);
  }

  registerUser(payload: {string: string}) {
    const url = `${this.authUrl}registration/`;
    return this.http.post<User>(url, payload)
      .do(user => {
        this._user.next(user);
      });
  }

  accountConfirmEmail(key: string) {
    const url = `${this.authUrl}registration/verify-email/`;
    return this.http.post(url, {key: key});
  }
}
