import { TestBed, inject } from '@angular/core/testing';

import { MeDisplayDropdownListService } from './me-display-dropdown-list.service';

describe('MeDisplayDropdownListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeDisplayDropdownListService]
    });
  });

  it('should be created', inject([MeDisplayDropdownListService], (service: MeDisplayDropdownListService) => {
    expect(service).toBeTruthy();
  }));
});
