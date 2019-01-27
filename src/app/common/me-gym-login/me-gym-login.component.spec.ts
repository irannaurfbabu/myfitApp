import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymLoginComponent } from './me-gym-login.component';

describe('MeGymLoginComponent', () => {
  let component: MeGymLoginComponent;
  let fixture: ComponentFixture<MeGymLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
