import { TestBed, inject } from '@angular/core/testing';

import { MeImageUploadService } from './me-image-upload.service';

describe('MeImageUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeImageUploadService]
    });
  });

  it('should be created', inject([MeImageUploadService], (service: MeImageUploadService) => {
    expect(service).toBeTruthy();
  }));
});
