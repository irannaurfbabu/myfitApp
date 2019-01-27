import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymCreateExpenseComponent } from './me-gym-create-expense.component';

describe('MeGymCreateExpenseComponent', () => {
  let component: MeGymCreateExpenseComponent;
  let fixture: ComponentFixture<MeGymCreateExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymCreateExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymCreateExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
