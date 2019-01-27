import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymManagePaymentsComponent } from './me-gym-manage-payments.component';

describe('MeGymManagePaymentsComponent', () => {
  let component: MeGymManagePaymentsComponent;
  let fixture: ComponentFixture<MeGymManagePaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymManagePaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymManagePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
