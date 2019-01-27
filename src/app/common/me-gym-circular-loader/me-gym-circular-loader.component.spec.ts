import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymCircularLoaderComponent } from './me-gym-circular-loader.component';

describe('MeGymCircularLoaderComponent', () => {
  let component: MeGymCircularLoaderComponent;
  let fixture: ComponentFixture<MeGymCircularLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymCircularLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymCircularLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
