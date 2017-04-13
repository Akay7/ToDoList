import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderById'
})
export class OrderByIdPipe implements PipeTransform {
  transform(objects: object[], args?: any): any {
    if (!objects) {
      return objects;
    }

    objects.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    return objects;
  }
}
