import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymCollectPaymentComponent } from './me-gym-collect-payment.component';

describe('MeCollectPaymentComponent', () => {
  let component: MeGymCollectPaymentComponent;
  let fixture: ComponentFixture<MeGymCollectPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymCollectPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymCollectPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
