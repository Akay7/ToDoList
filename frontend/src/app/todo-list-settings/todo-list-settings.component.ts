import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { TodoListService } from '../todo-list.service';
import { TodoList } from '../todo-list';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-todo-list-settings',
  templateUrl: './todo-list-settings.component.html',
  styleUrls: ['./todo-list-settings.component.scss']
})
export class TodoListSettingsComponent implements OnInit {
  todoList: TodoList;
  user: User;
  ownerId: number;
  errors: {string: any};
  ownerOptions;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private todoListService: TodoListService,
              private authService: AuthService) {  }

  ngOnInit() {
    this.authService.user.subscribe(user => {
      this.user = user;
      this.setOwnerOptions();
    });

    this.route.params
      .switchMap((params: Params) => this.todoListService.get(params['id']))
      .subscribe(todoList => {
        this.todoList = todoList;
        this.setOwnerOptions();
      }, error => {
        this.router.navigate(['/my-todo-lists']);
      });
  }

  private setOwnerOptions() {
    this.ownerOptions = [
      {'value': null, 'description': 'No one'},
    ];
    if (this.user) {
      this.ownerOptions.push({'value': this.user.pk, 'description': 'Me'});
    }
    if (this.todoList && this.todoList.owner && (this.user === null || this.todoList.owner !== this.user.pk)) {
      this.ownerOptions.push({'value': this.todoList.owner, 'description': 'Other User'});
    }
  }

  updateTodoList(form): void {
    this.todoListService.update(this.todoList.id, form.value)
      .then(success => this.errors = null,
            error => this.errors = error.json());
  }

  deleteTodoList(): void {
    this.todoListService.delete(this.todoList.id).then(
      success => { this.router.navigate(['/']); },
      error => { console.log(`can't delete todo list`); }
    );
  }

  get isCanEdit(): boolean {
    return (
      (this.user && this.todoList.owner === this.user.pk) ||
      (this.todoList.owner === null && this.todoList.mode === 'full_access')
    );
  }

}
