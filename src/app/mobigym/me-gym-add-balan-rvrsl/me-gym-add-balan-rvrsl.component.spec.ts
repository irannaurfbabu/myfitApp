import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymAddBalanRvrslComponent } from './me-gym-add-balan-rvrsl.component';

describe('MeGymAddBalanRvrslComponent', () => {
  let component: MeGymAddBalanRvrslComponent;
  let fixture: ComponentFixture<MeGymAddBalanRvrslComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymAddBalanRvrslComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymAddBalanRvrslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
