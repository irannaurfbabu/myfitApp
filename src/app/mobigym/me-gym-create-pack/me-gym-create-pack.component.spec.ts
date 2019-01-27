import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymCreatePackComponent } from './me-gym-create-pack.component';

describe('MeGymCreatePackComponent', () => {
  let component: MeGymCreatePackComponent;
  let fixture: ComponentFixture<MeGymCreatePackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymCreatePackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymCreatePackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
