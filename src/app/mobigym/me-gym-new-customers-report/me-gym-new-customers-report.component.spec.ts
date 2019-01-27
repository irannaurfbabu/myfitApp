import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymNewCustomersReportComponent } from './me-gym-new-customers-report.component';

describe('MeGymNewCustomersReportComponent', () => {
  let component: MeGymNewCustomersReportComponent;
  let fixture: ComponentFixture<MeGymNewCustomersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymNewCustomersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymNewCustomersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
