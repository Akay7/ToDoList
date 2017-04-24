import { TestBed, async } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-items.component';
import { OrderByIdPipe } from './order-by-id.pipe';
import { TodoItemService } from './todo.service';
import {TodoItem} from './todo-item';

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
        TodoListComponent,
        OrderByIdPipe
      ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: TodoItemService, useClass: MockTodoService}
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
