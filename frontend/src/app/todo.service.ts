import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { TodoItem } from './todo-item';

@Injectable()
export class TodoService {
  private todoItemsUrl = 'api/web/todo_item/';

  constructor(private http: Http) { }

  getTodoItems(): Promise<TodoItem[]> {
    return this.http.get(this.todoItemsUrl)
      .toPromise()
      .then(response => response.json() as TodoItem[])
      .catch(this.handleError);
  }

  createTodoItem(title: string): Promise<TodoItem> {
    return this.http
      .post(this.todoItemsUrl, {title: title})
      .toPromise()
      .then(res => res.json() as TodoItem)
      .catch(this.handleError);
  }

  updateTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    const url = `${this.todoItemsUrl}${todoItem.id}/`;
    return this.http
      .put(url, todoItem)
      .toPromise()
      .then(res => res.json() as TodoItem)
      .catch(this.handleError);
  }

  deleteTodoItem(id: number): Promise<void> {
    const url = `${this.todoItemsUrl}${id}/`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error accured', error);
    return Promise.reject(error.message || error);
  }
}
