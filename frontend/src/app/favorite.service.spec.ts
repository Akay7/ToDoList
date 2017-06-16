import { tick, fakeAsync} from '@angular/core/testing';
import {ReflectiveInjector} from '@angular/core';
import {BaseRequestOptions, ConnectionBackend, Http, RequestOptions} from '@angular/http';
import {Response, ResponseOptions} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { FavoriteService } from './favorite.service';

import {Favorite} from './favorite';
import {AuthService} from './auth.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {User} from './user';


class MockAuthService {
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  get user() {
    return this._user.asObservable();
  }

  login(payload: {string: string}) {
    this._user.next({
      'username': 'Test User'
    } as User);
  }

  logout() {
    this._user.next(null);
  }
}

describe('FavoriteService', () => {

  it('should get favorites', fakeAsync(() => {
    let connection: MockConnection;
    let favorites: Favorite[];
    const injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      Http,
      AuthService,
      FavoriteService,
    ]);
    const backend = injector.get(ConnectionBackend);
    const favoriteService = injector.get(FavoriteService);

    backend.connections.subscribe((c: MockConnection) => connection = c);

    const mockFavoriteResponse = [
      { 'todo_list': '001' },
      { 'todo_list': '002' }
    ];

    favoriteService.reloadFavorites();
    favoriteService.favorite.subscribe(favorite => favorites = favorite);
    connection.mockRespond(new Response(new ResponseOptions({body: mockFavoriteResponse})));
    tick();
    expect(favorites.length).toBe(2);
  }));

  it('should clear favorites when user logout', fakeAsync(() => {
    let connection: MockConnection;
    let favorites: Favorite[];
    const injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      {provide: AuthService, useClass: MockAuthService},
      Http,
      FavoriteService,

    ]);
    const authService = injector.get(AuthService);
    const backend = injector.get(ConnectionBackend);
    const favoriteService = injector.get(FavoriteService);
    backend.connections.subscribe((c: MockConnection) => connection = c);

    const mockFavoriteResponse = [
      { 'todo_list': '001' },
      { 'todo_list': '002' }
    ];

    favoriteService.reloadFavorites();
    authService.login();
    favoriteService.favorite.subscribe(favorite => favorites = favorite);
    connection.mockRespond(new Response(new ResponseOptions({body: mockFavoriteResponse})));
    tick();
    expect(favorites.length).toBe(2);

    // after user logout favorite list must be empty
    // after logout not make any connection for get favorites, because just user can have favorite
    authService.logout();
    expect(favorites.length).toBe(0);

    // try to login and get not empty list
    authService.login();
    connection.mockRespond(new Response(new ResponseOptions({body: mockFavoriteResponse})));
    tick();
    expect(favorites.length).toBe(2);
  }));
});
