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
    return todoList.owner === this.user.pk;
  }

}
