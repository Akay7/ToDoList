import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Watch } from './watch';

@Injectable()
export class WatchService {
  private watchUrl = '/api/web/watch/';
  private _watch: BehaviorSubject<Watch[]> = new BehaviorSubject<Watch[]>([]);
  private _watchStore: Watch[];

  constructor(private http: Http) {
    this.http.get(this.watchUrl)
    .map(res => res.json())
    .subscribe(data => {
      this._watchStore = data;
      this._watch.next(this._watchStore);
    });
  }

  get watch() {
    return this._watch.asObservable();
  }

  startWatch(todoListId: string): void {
    this.http
      .post(this.watchUrl, {todo_list: todoListId})
      .map(response => response.json())
      .subscribe(data => {
        this._watchStore.push(data);
        this._watch.next(this._watchStore);
      }, error => console.log('Could not watch Todo list'));
  }

  stopWatch(todoListId: string): void {
    this.http
      .delete(`${this.watchUrl}${todoListId}/`)
      .map(response => response.json())
      .subscribe(data => {
        this._watchStore = this._watchStore.filter(w => w.todo_list !== todoListId);
        this._watch.next(this._watchStore);
      }, error => console.log('Could not unwatch Todo list'));
  }
}
