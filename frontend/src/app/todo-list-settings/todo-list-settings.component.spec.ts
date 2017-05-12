import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListSettingsComponent } from './todo-list-settings.component';

describe('TodoListSettingsComponent', () => {
  let component: TodoListSettingsComponent;
  let fixture: ComponentFixture<TodoListSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoListSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
