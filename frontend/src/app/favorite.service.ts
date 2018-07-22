import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Favorite } from './favorite';
import { AuthService } from './auth.service';
import { User } from './user';

@Injectable()
export class FavoriteService {
  private favoriteUrl = '/api/web/favorite/';
  private _favorite: BehaviorSubject<Favorite[]> = new BehaviorSubject<Favorite[]>([]);
  private _favoriteStore: Favorite[];
  private user: User;

  constructor(private http: HttpClient,
              private authService: AuthService) {
    authService.user.subscribe(user => {
      this.user = user;
      if (!this.user) {
        this._favoriteStore = [];
        this._favorite.next(this._favoriteStore);
      } else {
        this.reload();
      }
    });
    this.reload();
  }

  private reload() {
    this.http.get<Favorite[]>(this.favoriteUrl)
      .subscribe(data => {
        this._favoriteStore = data;
        this._favorite.next(this._favoriteStore);
      });
  }

  get favorite() {
    return this._favorite.asObservable();
  }

  addToFavorite(todoListId: string): void {
    this.http
      .post<Favorite>(this.favoriteUrl, {todo_list: todoListId})
      .subscribe(favorite => {
        this._favoriteStore.push(favorite);
        this._favorite.next(this._favoriteStore);
      }, error => console.log('Could not add to favorite Todo list'));
  }

  removeFromFavorite(todoListId: string): void {
    this.http
      .delete(`${this.favoriteUrl}${todoListId}/`)
      .subscribe(data => {
        this._favoriteStore = this._favoriteStore.filter(f => f.todo_list !== todoListId);
        this._favorite.next(this._favoriteStore);
      }, error => console.log('Could not remove Todo list from favorite'));
  }
}
