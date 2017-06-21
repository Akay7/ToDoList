import { TestBed, async } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { OrderByIdPipe } from './order-by-id.pipe';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TodoListComponent,
        OrderByIdPipe
      ],
      imports: [
        FormsModule
      ]
    }).compileComponents();
  }));

});
