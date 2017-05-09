import { Pipe, PipeTransform } from '@angular/core';
import { Favorite } from './favorite';
import { FavoriteService } from './favorite.service';

@Pipe({
  name: 'favorite',
  pure: false
})
export class FavoritePipe implements PipeTransform {
  favorite: Favorite[];

  constructor(private favoriteService: FavoriteService) {
    this.favoriteService.favorite.subscribe(favorite => this.favorite = favorite);
  }

  transform(value: any, args?: any): any {
    return !!this.favorite.filter(f => f.todo_list === value).length;
  }

}
