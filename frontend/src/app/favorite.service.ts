import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Favorite } from './favorite';

@Injectable()
export class FavoriteService {
  private favoriteUrl = '/api/web/favorite/';
  private _favorite: BehaviorSubject<Favorite[]> = new BehaviorSubject<Favorite[]>([]);
  private _favoriteStore: Favorite[];

  constructor(private http: Http) {
    this.http.get(this.favoriteUrl)
      .map(res => res.json())
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
      .post(this.favoriteUrl, {todo_list: todoListId})
      .map(response => response.json())
      .subscribe(data => {
        this._favoriteStore.push(data);
        this._favorite.next(this._favoriteStore);
      }, error => console.log('Could not add to favorite Todo list'));
  }

  removeFromFavorite(todoListId: string): void {
    this.http
      .delete(`${this.favoriteUrl}${todoListId}/`)
      .map(response => response.json())
      .subscribe(data => {
        this._favoriteStore = this._favoriteStore.filter(f => f.todo_list !== todoListId);
        this._favorite.next(this._favoriteStore);
      }, error => console.log('Could not remove Todo list from favorite'));
  }
}
