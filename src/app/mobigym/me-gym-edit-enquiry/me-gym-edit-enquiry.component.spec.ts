import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymEditEnquiryComponent } from './me-gym-edit-enquiry.component';

describe('MeGymEditEnquiryComponent', () => {
  let component: MeGymEditEnquiryComponent;
  let fixture: ComponentFixture<MeGymEditEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymEditEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymEditEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
