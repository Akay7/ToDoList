import {Component, OnInit} from '@angular/core';

import {TodoItem} from './todo-item';
import {TodoService} from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TodoService]
})

export class AppComponent implements OnInit {
  title = 'ToDo list!';
  todo_items: TodoItem[];
  selected_todo_item: TodoItem;

  constructor (private todoService: TodoService ) { }

  ngOnInit(): void {
    this.getTodoItems();
  }

  getTodoItems(): void {
    this.todoService.getTodoItems().then(todo_items => this.todo_items = todo_items);
  }

  editTodoItem(item: TodoItem): void {
    this.selected_todo_item = item;
  }
  saveTodoItem(item: TodoItem): void {
    this.selected_todo_item = null;
  }

  createTodoItem(title: string): void {
    this.todo_items.push({ id: 3, title: title, status: false} as TodoItem);
  }
}
