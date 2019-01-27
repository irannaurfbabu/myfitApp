import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymManageEmployeesComponent } from './me-gym-manage-employees.component';

describe('MeGymManageEmployeesComponent', () => {
  let component: MeGymManageEmployeesComponent;
  let fixture: ComponentFixture<MeGymManageEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymManageEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymManageEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
