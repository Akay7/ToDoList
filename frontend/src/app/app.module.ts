import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { ChannelService } from './channel.service';
import { WebSocketService } from './web-socket.service';
import { TodoListService } from './todo-list.service';
import { TodoItemService } from './todo-item.service';
import { OrderByIdPipe } from './order-by-id.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    TodoListComponent,
    OrderByIdPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    TodoListService,
    TodoItemService,
    ChannelService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
