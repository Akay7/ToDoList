import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieXSRFStrategy, HttpModule, XSRFStrategy } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthComponent } from './auth/auth.component';
import { MyTodoListsComponent } from './my-todo-lists/my-todo-lists.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { ChannelService } from './channel.service';
import { WebSocketService } from './web-socket.service';
import { AuthService } from './auth.service';
import { TodoListService } from './todo-list.service';
import { TodoItemService } from './todo-item.service';
import { WatchService } from './watch.service';
import { FavoriteService } from './favorite.service';
import { WatchPipe } from './watch.pipe';
import { OrderByIdPipe } from './order-by-id.pipe';
import { FavoritePipe } from './favorite.pipe';


export function xsrfFactory() {
  return new CookieXSRFStrategy('csrftoken', 'X-CSRFToken');
}

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MyTodoListsComponent,
    AuthComponent,
    TodoListComponent,
    OrderByIdPipe,
    WatchPipe,
    FavoritePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    {provide: XSRFStrategy, useFactory: xsrfFactory},
    AuthService,
    TodoListService,
    TodoItemService,
    WatchService,
    FavoriteService,
    ChannelService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
