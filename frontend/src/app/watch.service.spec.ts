import { tick, fakeAsync } from '@angular/core/testing';
import { ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Watch } from './watch';
import { WatchService } from './watch.service';
import { AuthService } from 'app/auth.service';
import { MockAuthService } from './mock.auth.service';

describe('WatchService', () => {

  it('should get watch', fakeAsync(() => {
    let connection: MockConnection;
    let watch: Watch[];
    const injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      {provide: AuthService, useClass: MockAuthService},
      Http,
      WatchService,
    ]);
    const authService = injector.get(AuthService);
    const backend = injector.get(ConnectionBackend);
    const watchService = injector.get(WatchService);

    backend.connections.subscribe((c: MockConnection) => connection = c);

    const mockWatchResponse = [
      { 'todo_list': '001' },
      { 'todo_list': '002' }
    ];

    authService.login();
    watchService.watch.subscribe(w => watch = w);
    connection.mockRespond(new Response(new ResponseOptions({body: mockWatchResponse})));
    tick();
    expect(watch.length).toBe(2);
  }));

  it('should clear watch when user logout', fakeAsync(() => {
    let connection: MockConnection;
    let watch: Watch[];
    const injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      {provide: AuthService, useClass: MockAuthService},
      Http,
      WatchService,
    ]);
    const authService = injector.get(AuthService);
    const backend = injector.get(ConnectionBackend);
    const watchService = injector.get(WatchService);

    backend.connections.subscribe((c: MockConnection) => connection = c);

    const mockWatchResponse = [
      { 'todo_list': '001' },
      { 'todo_list': '002' }
    ];

    authService.login();
    watchService.watch.subscribe(w => watch = w);
    connection.mockRespond(new Response(new ResponseOptions({body: mockWatchResponse})));
    tick();
    expect(watch.length).toBe(2);

    // after user logout favorite list must be empty
    // after logout not make any connection for get favorites, because just user can have favorite
    authService.logout();
    expect(watch.length).toBe(0);

    // try to login and get not empty list
    authService.login();
    connection.mockRespond(new Response(new ResponseOptions({body: mockWatchResponse})));
    tick();
    expect(watch.length).toBe(2);
  }));
});
