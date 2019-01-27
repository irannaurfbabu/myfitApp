import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymManageComplaintsComponent } from './me-gym-manage-complaints.component';

describe('MeGymManageComplaintsComponent', () => {
  let component: MeGymManageComplaintsComponent;
  let fixture: ComponentFixture<MeGymManageComplaintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymManageComplaintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymManageComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
