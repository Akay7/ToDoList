import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MyTodoListsComponent } from './my-todo-lists/my-todo-lists.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordResetConfirmComponent } from './password-reset-confirm/password-reset-confirm.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'my-todo-lists', component: MyTodoListsComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'reset/:uid/:token', component: PasswordResetConfirmComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: ':id', component: TodoListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
