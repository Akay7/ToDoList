import { Injectable } from '@angular/core';

import { TODO_ITEMS } from './mock-todo-items';
import { TodoItem } from './todo-item';

@Injectable()
export class TodoService {
  getTodoItems(): Promise<TodoItem[]> {
    return Promise.resolve(TODO_ITEMS);
  }
}
