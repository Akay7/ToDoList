import { Pipe, PipeTransform } from '@angular/core';
import { WatchService } from './watch.service';
import { Watch } from './watch';
import { TodoList } from 'app/todo-list';

@Pipe({
  name: 'watch',
  pure: false
})

export class WatchPipe implements PipeTransform {
  watch: Watch[];

  constructor(private watchService: WatchService) {
    this.watchService.watch.subscribe(watch => this.watch = watch);
  }

  transform(todoList: TodoList, args?: any): any {
    return !!this.watch.filter(w => w.todo_list === todoList.id).length;
  }

}
