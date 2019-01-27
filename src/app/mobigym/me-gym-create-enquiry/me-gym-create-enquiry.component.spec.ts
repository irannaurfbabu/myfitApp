import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymCreateEnquiryComponent } from './me-gym-create-enquiry.component';

describe('MeGymCreateEnquiryComponent', () => {
  let component: MeGymCreateEnquiryComponent;
  let fixture: ComponentFixture<MeGymCreateEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymCreateEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymCreateEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
