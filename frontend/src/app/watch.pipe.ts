import { Pipe, PipeTransform } from '@angular/core';
import { WatchService } from './watch.service';
import { Watch } from './watch';

@Pipe({
  name: 'watch',
  pure: false
})

export class WatchPipe implements PipeTransform {
  watch: Watch[];

  constructor(private watchService: WatchService) {
    this.watchService.watch.subscribe(watch => this.watch = watch);
  }

  transform(value: any, args?: any): any {
    return this.watch.filter(w => w.todo_list === value).length;
  }

}
