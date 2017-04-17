import { Component, OnInit } from '@angular/core';

import { TodoItem } from '../todo-item';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-items',
  templateUrl: './todo-items.component.html',
  styleUrls: ['./todo-items.component.css']
})
export class TodoItemsComponent implements OnInit {
  todoItems: TodoItem[];
  selectedTodoItem: TodoItem;

  constructor (private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.todoItems.subscribe(todoItems => this.todoItems = todoItems);
    this.todoService.loadAll();
  }

  editTodoItem(item: TodoItem): void {
    this.selectedTodoItem = item;
  }

  save(todoItem: TodoItem): void {
    this.todoService.updateTodoItem(todoItem);
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoService.createTodoItem(title);
  }

  delete(todoItem: TodoItem): void {
    this.todoService.deleteTodoItem(todoItem.id);
  }
}
