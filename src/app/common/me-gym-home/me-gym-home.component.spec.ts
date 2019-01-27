import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymHomeComponent } from './me-gym-home.component';

describe('MeGymHomeComponent', () => {
  let component: MeGymHomeComponent;
  let fixture: ComponentFixture<MeGymHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
