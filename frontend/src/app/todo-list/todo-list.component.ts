import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { TodoItem } from '../todo-item';
import { TodoList } from '../todo-list';
import { TodoItemService } from '../todo-item.service';
import { TodoListService } from '../todo-list.service';
import { WatchService } from '../watch.service';
import {FavoriteService} from "../favorite.service";

@Component({
  selector: 'app-todo-items',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  @Input() todoList: TodoList;
  todoItems: TodoItem[];
  selectedTodoItem: TodoItem;
  isEditTitle = false;

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private todoListService: TodoListService,
    private todoItemService: TodoItemService,
    private watchService: WatchService,
    private favoriteService: FavoriteService
  ) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.todoListService.get(params['id']))
      .subscribe(todoList => {
        this.todoList = todoList;
        this.todoItemService.getTodoItems(this.todoList.id).subscribe(todoItems => this.todoItems = todoItems);
      }, error => {
        // when todo_list not exist or can't get redirect to main page
        this.router.navigate(['/']);
      });
  }

  editTodoListTitle(): void {
    this.isEditTitle = true;
  }
  saveTodoListTitle(): void {
    this.todoListService.update(this.todoList).then(
      success => { this.isEditTitle = false; },
      error => { console.log(`can't update title`); }
    );
  }
  deleteTodoList(): void {
    this.todoListService.delete(this.todoList).then(
      success => { this.router.navigate(['/']); },
      error => { console.log(`can't delete todo list`); }
    );
  }
  watch(todoListId) {
    this.watchService.startWatch(todoListId);
  }
  unwatch(todoListId) {
    this.watchService.stopWatch(todoListId);
  }

  addToFavorite(todoListId) {
    this.favoriteService.addToFavorite(todoListId);
  }
  removeFromFavorite(todoListId) {
    this.favoriteService.removeFromFavorite(todoListId);
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
