import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymDueReportComponent } from './me-gym-due-report.component';

describe('MeGymDueReportComponent', () => {
  let component: MeGymDueReportComponent;
  let fixture: ComponentFixture<MeGymDueReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymDueReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymDueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
