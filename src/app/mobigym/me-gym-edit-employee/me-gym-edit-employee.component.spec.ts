import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymEditEmployeeComponent } from './me-gym-edit-employee.component';

describe('MeGymEditEmployeeComponent', () => {
  let component: MeGymEditEmployeeComponent;
  let fixture: ComponentFixture<MeGymEditEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymEditEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymEditEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
