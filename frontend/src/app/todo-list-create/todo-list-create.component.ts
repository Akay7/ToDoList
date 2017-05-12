import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { TodoListService } from '../todo-list.service';

@Component({
  selector: 'app-todo-list-create',
  templateUrl: './todo-list-create.component.html',
  styleUrls: ['./todo-list-create.component.scss']
})
export class TodoListCreateComponent implements OnInit {
  user: User;
  errors: {string: any};
  owner = null;
  mode = 'full_access';

  constructor(private router: Router,
              private authService: AuthService,
              private todoListService: TodoListService) {
    this.authService.user.subscribe(user => this.user = user);
  }

  ngOnInit() {
  }

  createTodoList(form: NgForm) {
    this.todoListService.create(form.value)
      .then(data => this.router.navigate(['/', data.id]),
            error => this.errors = error.json() );
  }
}
