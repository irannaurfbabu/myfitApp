import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymAddEmployeeComponent } from './me-gym-add-employee.component';

describe('MeGymAddEmployeeComponent', () => {
  let component: MeGymAddEmployeeComponent;
  let fixture: ComponentFixture<MeGymAddEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymAddEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymAddEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
