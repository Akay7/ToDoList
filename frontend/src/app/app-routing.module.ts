import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MyTodoListsComponent } from './my-todo-lists/my-todo-lists.component';
import { TodoListCreateComponent} from './todo-list-create/todo-list-create.component';
import { TodoListSettingsComponent} from './todo-list-settings/todo-list-settings.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordResetConfirmComponent } from './password-reset-confirm/password-reset-confirm.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AccountConfirmEmailComponent } from './account-confirm-email/account-confirm-email.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'my-todo-lists', component: MyTodoListsComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'reset/:uid/:token', component: PasswordResetConfirmComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'registration/account-confirm-email/:key', component: AccountConfirmEmailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'todo-list-create', component: TodoListCreateComponent },
  { path: ':id/settings', component: TodoListSettingsComponent },
  { path: ':id', component: TodoListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
