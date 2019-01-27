import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymNavigationComponent } from './me-gym-navigation.component';

describe('MeGymNavigationComponent', () => {
  let component: MeGymNavigationComponent;
  let fixture: ComponentFixture<MeGymNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
