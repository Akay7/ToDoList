import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MyTodoListsComponent } from './my-todo-lists/my-todo-lists.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'my-todoList-lists', component: MyTodoListsComponent },
  { path: ':id', component: TodoListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
