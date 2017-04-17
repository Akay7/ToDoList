import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ChannelService } from './channel.service';
import { TodoItem } from './todo-item';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TodoService {
  private todoItemsUrl = 'api/web/todo_item/';

  private _todoItems: Subject<TodoItem[]>;
  private dataStore: {
    todoItems: TodoItem[];
  };

  constructor(private http: Http,
              private channelService: ChannelService) {
    this.dataStore = { todoItems: []};

    this._todoItems = new Subject<TodoItem[]>();

    this.channelService.messages.map(msg => msg.payload).subscribe(payload => {
      const data = payload['data'];
      data['id'] = payload['pk'];

      if (payload['action'] === 'create') {
        // add new todo_item only if it not exist
        if (!this.dataStore.todoItems.filter(todo => todo.id === data['id']).length) {
          this.dataStore.todoItems.push(data);
        }
      } else if (payload['action'] === 'update') {
        this.dataStore.todoItems.forEach((t, i) => {
          if (t.id === data['id']) { this.dataStore.todoItems[i] = data; }
        });
      } else if (payload['action'] === 'delete') {
        this.dataStore.todoItems = this.dataStore.todoItems.filter(todo => todo.id !== data['id']);
      }
      this._todoItems.next(Object.assign({}, this.dataStore).todoItems);
    });
  }

  get todoItems() {
    return this._todoItems.asObservable();
  }

  loadAll() {
    this.http.get(this.todoItemsUrl).map(res => res.json()).subscribe(
      data => {
        this.dataStore.todoItems = data;
        this._todoItems.next(Object.assign({}, this.dataStore).todoItems);
      }, error => console.log('Could not load todoItems'));
  }

  createTodoItem(title: string) {
    return this.http
      .post(this.todoItemsUrl, {title: title})
      .map(response => response.json()).subscribe(data => {
        // sometimes socket can create new todo_item before response come
        if (!this.dataStore.todoItems.filter(todo => todo.id === data['id']).length) {
          this.dataStore.todoItems.push(data);
        }
        this._todoItems.next(Object.assign({}, this.dataStore).todoItems);
      }, error => console.log('Could not create todo'));
  }

  updateTodoItem(todoItem: TodoItem) {
    const url = `${this.todoItemsUrl}${todoItem.id}/`;
    this.http.put(url, todoItem)
      .map(response => response.json())
      .subscribe(data => {
        this.dataStore.todoItems.forEach((t, i) => {
          if (t.id === data.id) { this.dataStore.todoItems[i] = data; }
        });

        this._todoItems.next(Object.assign({}, this.dataStore).todoItems);
      }, error => console.log('Could not update todo.'));
  }

  deleteTodoItem(id: number) {
    const url = `${this.todoItemsUrl}${id}/`;
    this.http.delete(url)
      .subscribe(response => {
        this.dataStore.todoItems = this.dataStore.todoItems.filter(todo => todo.id !== id);
        this._todoItems.next(Object.assign({}, this.dataStore).todoItems);
      }, error => console.log('Could not delete todo'));
  }
}
