import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';

export class MockAuthService {
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
