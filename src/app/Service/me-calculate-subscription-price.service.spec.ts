import { TestBed, inject } from '@angular/core/testing';

import { MeCalculateSubscriptionPriceService } from './me-calculate-subscription-price.service';

describe('MeCalculateSubscriptionPriceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeCalculateSubscriptionPriceService]
    });
  });

  it('should be created', inject([MeCalculateSubscriptionPriceService], (service: MeCalculateSubscriptionPriceService) => {
    expect(service).toBeTruthy();
  }));
});
