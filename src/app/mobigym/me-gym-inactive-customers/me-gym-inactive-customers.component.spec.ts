import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymInactiveCustomersComponent } from './me-gym-inactive-customers.component';

describe('MeGymInactiveCustomersComponent', () => {
  let component: MeGymInactiveCustomersComponent;
  let fixture: ComponentFixture<MeGymInactiveCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymInactiveCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymInactiveCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
