import { Component, OnInit } from '@angular/core';
import { TodoListService } from '../todo-list.service';
import { TodoList } from '../todo-list';

@Component({
  selector: 'app-my-todo-lists',
  templateUrl: './my-todo-lists.component.html',
  styleUrls: ['./my-todo-lists.component.scss']
})
export class MyTodoListsComponent implements OnInit {
  todoLists: TodoList[];
  selectedTodoList: TodoList;

  constructor(private todoListService: TodoListService) { }

  ngOnInit() {
    this.todoListService.getAll().then(
      todoLists => this.todoLists = todoLists
    );
  }

  select(todoList) {
    this.selectedTodoList = this.selectedTodoList !== todoList ? todoList : null;
  }

}
