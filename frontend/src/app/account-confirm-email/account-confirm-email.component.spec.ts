import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountConfirmEmailComponent } from './account-confirm-email.component';

describe('AccountConfirmEmailComponent', () => {
  let component: AccountConfirmEmailComponent;
  let fixture: ComponentFixture<AccountConfirmEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountConfirmEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
