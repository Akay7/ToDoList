import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import {User} from './user';

@Injectable()
export class AuthService {
  private authUrl = '/api/web/';
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private _errors: Subject<{string: Array<string>}>;

  constructor(private http: Http) {
    this._errors = new Subject<{string: Array<string>}>();
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
  get errors() {
    return this._errors.asObservable();
  }

  login(username: string, password: string) {
    const url = `${this.authUrl}login/`;
    const payload = {username: username, password: password};
    this.http.post(url, payload)
      .map(res => res.json())
      .subscribe(data => {
        this._user.next(data);
        this._errors.next();
      }, error => {
        this._errors.next(error.json());
      });
  }

  logout() {
    const url = `${this.authUrl}logout/`;
    this.http.post(url, {})
      .subscribe(res => {
        this._user.next(null);
      });
  }
}
