import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { User } from './user';

@Injectable()
export class AuthService {
  private authUrl = '/api/web/';
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private http: Http) {
    const url = `${this.authUrl}user/`;
    this.http.get(url)
      .map(res => res.json())
      .subscribe(data => {
        this._user.next(data);
      });
  }

  get user() {
    return this._user.asObservable();
  }

  login(payload: {string: string}) {
    const url = `${this.authUrl}login/`;
    return this.http.post(url, payload)
      .do(res => {
        this._user.next(res.json());
      });
  }

  logout() {
    const url = `${this.authUrl}logout/`;
    return this.http.post(url, {})
      .do(res => {
        this._user.next(null);
      });
  }

  passwordReset(email: string) {
    const url = `${this.authUrl}password/reset/`;
    return this.http.post(url, {email: email}).toPromise();
  }

  passwordResetConfirm(uid, token, new_password1, new_password2) {
    const url = `${this.authUrl}password/reset/confirm/`;
    const payload = {
      uid: uid,
      token: token,
      new_password1: new_password1,
      new_password2: new_password2
    };
    return this.http.post(url, payload).toPromise();
  }

  registerUser(username, email, password1, password2) {
    const url = `${this.authUrl}registration/`;
    const payload = {
      username: username,
      password1: password1,
      password2: password2
    };
    if (email) {
      payload['email'] = email;
    }

    return this.http.post(url, payload)
      .do(response => {
        this._user.next(response.json());
      });
  }

  accountConfirmEmail(key: string) {
    const url = `${this.authUrl}registration/verify-email/`;
    return this.http.post(url, {key: key});
  }
}
