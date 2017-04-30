import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { TodoList } from './todo-list';

@Injectable()
export class TodoListService {
  private todoListUrl = 'api/web/todo_list/';

  constructor(private http: Http) { }

  get(todoListId: string): Promise<TodoList> {
    const url = `${this.todoListUrl}${todoListId}/`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as TodoList)
      .catch(this.handleError);
  }

  update(todoList: TodoList): Promise<TodoList> {
    const url = `${this.todoListUrl}${todoList.id}/`;
    return this.http
      .put(url, todoList)
      .toPromise()
      .then(res => res.json() as TodoList)
      .catch(this.handleError);
  }

  delete(todoList: TodoList): Promise<void> {
    const url = `${this.todoListUrl}${todoList.id}/`;
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
