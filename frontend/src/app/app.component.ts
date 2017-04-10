import { Component } from '@angular/core';

export class ToDoItem {
  id: number;
  title: string;
  status: boolean;
}

const TODO_ITEMS: ToDoItem[] = [
  { id: 1, title: 'Awake', status: true},
  { id: 2, title: 'Brush teeth', status: true},
  { id: 3, title: 'Procrastinate', status: false},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ToDo list!';
  selected_todo_item: ToDoItem;

  todo_items = TODO_ITEMS;

  editTodoItem(item: ToDoItem): void {
    this.selected_todo_item = item;
  }
  saveTodoItem(item: ToDoItem): void {
    this.selected_todo_item = null;
  }

  createTodoItem(title: string): void {
    this.todo_items.push({ id: 3, title: title, status: false} as ToDoItem);
  }
}
