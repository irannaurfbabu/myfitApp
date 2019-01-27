import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymEditExpenseComponent } from './me-gym-edit-expense.component';

describe('MeGymEditExpenseComponent', () => {
  let component: MeGymEditExpenseComponent;
  let fixture: ComponentFixture<MeGymEditExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymEditExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymEditExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
