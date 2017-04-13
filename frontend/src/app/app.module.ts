import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TodoService } from './todo.service';
import { TodoItemsComponent } from './todo-items/todo-items.component';
import { OrderByIdPipe } from './order-by-id.pipe';

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
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
