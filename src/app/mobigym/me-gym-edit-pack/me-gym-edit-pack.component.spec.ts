import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymEditPackComponent } from './me-gym-edit-pack.component';

describe('MeGymEditPackComponent', () => {
  let component: MeGymEditPackComponent;
  let fixture: ComponentFixture<MeGymEditPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymEditPackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymEditPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
