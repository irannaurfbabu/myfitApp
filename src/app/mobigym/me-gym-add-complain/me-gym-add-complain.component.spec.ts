import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymAddComplainComponent } from './me-gym-add-complain.component';

describe('MeGymAddComplainComponent', () => {
  let component: MeGymAddComplainComponent;
  let fixture: ComponentFixture<MeGymAddComplainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymAddComplainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymAddComplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
