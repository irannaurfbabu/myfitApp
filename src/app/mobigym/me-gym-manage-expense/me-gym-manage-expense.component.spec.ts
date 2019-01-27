import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymManageExpenseComponent } from './me-gym-manage-expense.component';

describe('MeGymManageExpenseComponent', () => {
  let component: MeGymManageExpenseComponent;
  let fixture: ComponentFixture<MeGymManageExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymManageExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymManageExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
