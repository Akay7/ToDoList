import {Component, OnInit} from '@angular/core';

import {TodoItem} from './todo-item';
import {TodoService} from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  title = 'ToDo list!';
  todoItems: TodoItem[];
  selectedTodoItem: TodoItem;

  constructor (private todoService: TodoService ) { }

  ngOnInit(): void {
    this.getTodoItems();
  }

  getTodoItems(): void {
    this.todoService.getTodoItems().then(todo_items => this.todoItems = todo_items);
  }

  editTodoItem(item: TodoItem): void {
    this.selectedTodoItem = item;
  }
  saveTodoItem(item: TodoItem): void {
    this.selectedTodoItem = null;
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoService.createTodoItem(title)
      .then(todo => {
        this.todoItems.push(todo);
        this.selectedTodoItem = null;
      });
  }

  delete(todoItem: TodoItem): void {
    this.todoService
      .deleteTodoItem(todoItem.id)
      .then(() => {
        this.todoItems = this.todoItems.filter(todo => todo !== todoItem);
        if (this.selectedTodoItem === todoItem) { this.selectedTodoItem = null;}
      });
  }
}
