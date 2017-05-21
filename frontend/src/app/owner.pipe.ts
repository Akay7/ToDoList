import { Pipe, PipeTransform } from '@angular/core';
import {User} from './user';
import {AuthService} from './auth.service';
import {TodoList} from './todo-list';

@Pipe({
  name: 'owner',
  pure: false
})
export class OwnerPipe implements PipeTransform {
  user: User;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => this.user = user);
  }

  transform(todoList: TodoList, args?: any): any {
    // user with uid -1 will never exist in system
    const user_uid = this.user ? this.user.pk : -1;
    return todoList.owner === user_uid;
  }

}
