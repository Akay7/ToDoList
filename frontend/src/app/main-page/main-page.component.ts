import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoItemService } from '../todo-item.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  newTodoTitle: string;

  constructor(
    private router: Router,
    private todoItemService: TodoItemService) { }

  ngOnInit() {
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoItemService.createTodoItemWithNewList(title)
      .subscribe(
        response => this.router.navigate(['/', response.json().todo_list]),
        error => console.log(error.json())
      );
  }
}
