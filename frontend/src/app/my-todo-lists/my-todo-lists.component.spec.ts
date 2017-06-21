import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTodoListsComponent } from './my-todo-lists.component';

describe('MyTodoListsComponent', () => {
  let component: MyTodoListsComponent;
  let fixture: ComponentFixture<MyTodoListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTodoListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTodoListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
