import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { TodoItem } from '../todo-item';
import { TodoList } from '../todo-list';
import { TodoItemService } from '../todo-item.service';
import { TodoListService } from '../todo-list.service';

@Component({
  selector: 'app-todo-items',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  @Input() todoList: TodoList;
  todoItems: TodoItem[];
  selectedTodoItem: TodoItem;

  constructor (
    private route: ActivatedRoute,
    private todoListService: TodoListService,
    private todoItemService: TodoItemService
  ) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.todoListService.get(params['id']))
      .subscribe(todoList => {
        this.todoList = todoList;
        this.todoItemService.getTodoItems(this.todoList.id).subscribe(todoItems => this.todoItems = todoItems);
      });
  }

  editTodoItem(item: TodoItem): void {
    this.selectedTodoItem = item;
  }

  save(todoItem: TodoItem): void {
    this.todoItemService.updateTodoItem(todoItem);
    this.selectedTodoItem = null;
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoItemService.createTodoItem(title, this.todoList.id);
  }

  delete(todoItem: TodoItem): void {
    this.todoItemService.deleteTodoItem(todoItem);
  }
}
