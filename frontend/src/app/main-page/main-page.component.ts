import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoItemService } from '../todo-item.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  title = 'ToDo list!';

  constructor(
    private router: Router,
    private todoItemService: TodoItemService) { }

  ngOnInit() {
  }

  add(title: string): void {
    title = title.trim();
    if (!title) { return; }
    this.todoItemService.createTodoItemWithNewList(title).then(
      todoItem => this.router.navigate(['/', todoItem.todo_list])
    );

  }
}
