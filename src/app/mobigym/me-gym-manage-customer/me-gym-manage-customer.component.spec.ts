import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymManageCustomerComponent } from './me-gym-manage-customer.component';

describe('MeGymManageCustomerComponent', () => {
  let component: MeGymManageCustomerComponent;
  let fixture: ComponentFixture<MeGymManageCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymManageCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymManageCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
