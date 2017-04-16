import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TodoService } from './todo.service';
import { TodoItemsComponent } from './todo-items/todo-items.component';
import { OrderByIdPipe } from './order-by-id.pipe';
import { ChannelService } from './channel.service';
import { WebSocketService } from './web-socket.service';

@NgModule({
  declarations: [
    AppComponent,
    TodoItemsComponent,
    OrderByIdPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    TodoService,
    ChannelService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
