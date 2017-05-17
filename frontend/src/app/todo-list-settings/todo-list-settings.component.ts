import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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

  constructor(private router: Router,
              private route: ActivatedRoute,
              private todoListService: TodoListService,
              private authService: AuthService) {
    this.authService.user.subscribe(user => this.user = user);
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.todoListService.get(params['id']))
      .subscribe(todoList => {
        this.todoList = todoList;
        this.ownerId = todoList.owner;
      }, error => {
        this.router.navigate(['/my-todo-lists']);
      });
  }

  updateTodoList(form): void {
    this.todoListService.update(this.todoList)
      .then(success => this.errors = null,
            error => this.errors = error.json());
  }

  deleteTodoList(): void {
    this.todoListService.delete(this.todoList).then(
      success => { this.router.navigate(['/']); },
      error => { console.log(`can't delete todo list`); }
    );
  }

  get isCanEdit(): boolean {
    return this.todoList.owner === this.user.pk || this.todoList.owner === null;
  }

}
