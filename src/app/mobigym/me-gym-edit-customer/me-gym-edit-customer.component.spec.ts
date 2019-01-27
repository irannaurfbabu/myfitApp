import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymEditCustomerComponent } from './me-gym-edit-customer.component';

describe('MeGymEditCustomerComponent', () => {
  let component: MeGymEditCustomerComponent;
  let fixture: ComponentFixture<MeGymEditCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymEditCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymEditCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
