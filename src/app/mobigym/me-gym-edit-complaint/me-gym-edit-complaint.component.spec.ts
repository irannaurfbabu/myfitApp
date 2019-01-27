import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymEditComplaintComponent } from './me-gym-edit-complaint.component';

describe('MeGymEditComplaintComponent', () => {
  let component: MeGymEditComplaintComponent;
  let fixture: ComponentFixture<MeGymEditComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymEditComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymEditComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
