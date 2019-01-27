import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymCreateCustomerComponent } from './me-gym-create-customer.component';

describe('MeGymCreateCustomerComponent', () => {
  let component: MeGymCreateCustomerComponent;
  let fixture: ComponentFixture<MeGymCreateCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymCreateCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymCreateCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
