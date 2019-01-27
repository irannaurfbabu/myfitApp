import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymManagePackComponent } from './me-gym-manage-pack.component';

describe('MeGymManagePackComponent', () => {
  let component: MeGymManagePackComponent;
  let fixture: ComponentFixture<MeGymManagePackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymManagePackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymManagePackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
