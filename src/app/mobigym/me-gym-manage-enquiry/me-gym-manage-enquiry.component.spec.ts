import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeGymManageEnquiryComponent } from './me-gym-manage-enquiry.component';

describe('MeGymManageEnquiryComponent', () => {
  let component: MeGymManageEnquiryComponent;
  let fixture: ComponentFixture<MeGymManageEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeGymManageEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeGymManageEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
