import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymCollectionReportComponent } from './me-gym-collection-report.component';

describe('MeGymCollectionReportComponent', () => {
  let component: MeGymCollectionReportComponent;
  let fixture: ComponentFixture<MeGymCollectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymCollectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymCollectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
