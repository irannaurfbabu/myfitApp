import { TestBed, inject } from '@angular/core/testing';

import { MeGymToastNotificationService } from './me-gym-toast-notification.service';

describe('MeGymToastNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeGymToastNotificationService]
    });
  });

  it('should be created', inject([MeGymToastNotificationService], (service: MeGymToastNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
