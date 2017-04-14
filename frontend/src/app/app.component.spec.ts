import { TestBed, async } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TodoItemsComponent } from './todo-items/todo-items.component';
import { OrderByIdPipe } from './order-by-id.pipe';
import { TodoService } from './todo.service';
import {TodoItem} from "./todo-item";

class MockTodoService {
  TODO_ITEMS: TodoItem[] = [
    { id: 1, title: 'Awake', status: true},
    { id: 2, title: 'Brush teeth', status: true},
    { id: 3, title: 'Procrastinate', status: false},
  ];

  getTodoItems(): Promise<TodoItem[]> {
    return Promise.resolve(this.TODO_ITEMS);
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TodoItemsComponent,
        OrderByIdPipe
      ],
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        { provide: TodoService, useClass: MockTodoService}
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'ToDo list!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ToDo list!');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('ToDo list!');
  }));
});
