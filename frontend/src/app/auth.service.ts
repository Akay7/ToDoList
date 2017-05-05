import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import {User} from './user';

@Injectable()
export class AuthService {
  private authUrl = '/api/web/';
  private _user: Subject<User>;

  constructor(private http: Http) {
    this._user = new Subject<User>();
  }

  get user() {
    const url = `${this.authUrl}user/`;
    this.http.get(url).map(res => res.json()).subscribe(
      data => {
        this._user.next(data);
      }
    );
    return this._user.asObservable();
  }

  login(username: string, password: string) {
    const url = `${this.authUrl}login/`;
    const payload = {username: username, password: password};
    return this.http.post(url, payload)
      .subscribe(res => {
        console.log('in subscirbe');
        this._user.next(res.json());
        return res.json();
      });
  }
}
