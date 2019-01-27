import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymLinearLoaderComponent } from './me-gym-linear-loader.component';

describe('MeGymLinearLoaderComponent', () => {
  let component: MeGymLinearLoaderComponent;
  let fixture: ComponentFixture<MeGymLinearLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymLinearLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymLinearLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
