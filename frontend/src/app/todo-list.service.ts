import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TodoList } from './todo-list';

@Injectable()
export class TodoListService {
  private todoListUrl = 'api/web/todo_list/';

  constructor(private http: HttpClient) { }

  getAll(): Promise<TodoList[]> {
    const url = `${this.todoListUrl}`;
    return this.http.get<TodoList[]>(url)
      .toPromise()
      .catch(this.handleError);
  }

  get(todoListId: string): Promise<TodoList> {
    const url = `${this.todoListUrl}${todoListId}/`;
    return this.http.get<TodoList>(url)
      .toPromise()
      .catch(this.handleError);
  }

  create(payload) {
    return this.http
      .post<TodoList>(this.todoListUrl, payload)
      .toPromise()
      .catch(this.handleError);
  }

  update(id: string, payload): Promise<TodoList> {
    const url = `${this.todoListUrl}${id}/`;
    return this.http
      .put<TodoList>(url, payload)
      .toPromise()
      .catch(this.handleError);
  }

  delete(id: string): Promise<void> {
    const url = `${this.todoListUrl}${id}/`;
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
