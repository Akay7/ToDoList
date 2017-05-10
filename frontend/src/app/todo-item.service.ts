import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ChannelService } from './channel.service';
import { TodoItem } from './todo-item';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TodoItemService {
  private todoItemsUrl = 'api/web/todo_item/';

  private _todoItems: {[id: string]: Subject<TodoItem[]>};
  private dataStore: { [id: string]: TodoItem[] };

  constructor(private http: Http,
              private channelService: ChannelService) {
    this.dataStore = {};
    this._todoItems = {};
  }

  connectToChannels(listId: string) {
    this.channelService.connect(`todo_list=${listId}`).map(msg => msg.payload).subscribe(payload => {
      const todoItem = payload['data'];
      todoItem['id'] = payload['pk'];

      if (payload['action'] === 'create') {
        // add new todo_item only if it not exist
        if (!this.dataStore[todoItem.todo_list].filter(todo => todo.id === todoItem.id).length) {
          this.dataStore[todoItem.todo_list].push(todoItem);
        }
      } else if (payload['action'] === 'update') {
        this.dataStore[todoItem.todo_list].forEach((t, i) => {
          if (t.id === todoItem.id) { this.dataStore[todoItem.todo_list][i] = todoItem; }
        });
      } else if (payload['action'] === 'delete') {
        this.dataStore[todoItem.todo_list] = this.dataStore[todoItem.todo_list].filter(todo => todo.id !== todoItem.id);
      }
      this._todoItems[todoItem.todo_list].next(this.dataStore[todoItem.todo_list]);
    });
  }

  getTodoItems(listId: string) {
    this.connectToChannels(listId);
    const url = `${this.todoItemsUrl}?todo_list=${listId}`;

    this._todoItems[listId] = new Subject<TodoItem[]>();
    this.http.get(url).map(res => res.json()).subscribe(
      data => {
        this.dataStore[listId] = data;
        this._todoItems[listId].next(this.dataStore[listId]);
      }, error => console.log('Could not load todoItems'));
    return this._todoItems[listId].asObservable();
  }

  createTodoItemWithNewList(title: string): Promise<TodoItem> {
    return this.http
      .post(this.todoItemsUrl, {title: title})
      .toPromise()
      .then(res => res.json() as TodoItem,  error => console.log('Error create todo'));

  }

  createTodoItem(title: string, listId: string) {
    const url = `${this.todoItemsUrl}/?todo_list=${listId}`;
    return this.http
      .post(url, {title: title,  todo_list: listId})
      .map(response => response.json()).subscribe(data => {
        // sometimes socket can create new todo_item before response come
        if (!this.dataStore[listId].filter(todo => todo.id === data['id']).length) {
          this.dataStore[listId].push(data);
        }
        this._todoItems[listId].next(this.dataStore[listId]);
      }, error => console.log('Could not create todo'));
  }

  updateTodoItem(todoItem: TodoItem) {
    const url = `${this.todoItemsUrl}${todoItem.id}/?todo_list=${todoItem.todo_list}`;
    this.http.put(url, todoItem)
      .map(response => response.json())
      .subscribe(data => {
        this._todoItems[todoItem.todo_list].next(this.dataStore[todoItem.todo_list]);
      }, error => console.log('Could not update todo.'));
  }

  deleteTodoItem(todoItem: TodoItem) {
    const url = `${this.todoItemsUrl}${todoItem.id}/?todo_list=${todoItem.todo_list}`;
    this.http.delete(url)
      .subscribe(response => {
        this.dataStore[todoItem.todo_list] = this.dataStore[
          todoItem.todo_list].filter(todo => todo.id !== todoItem.id );
        this._todoItems[todoItem.todo_list].next(this.dataStore[todoItem.todo_list]);
      }, error => console.log('Could not delete todo'));
  }
}
