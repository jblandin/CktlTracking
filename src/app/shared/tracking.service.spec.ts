import {beforeEachProviders, it, describe, expect, inject} from '@angular/core/testing';
import {TrackingService} from './tracking.service';

describe('Tracking Service', () => {
  beforeEachProviders(() => [TrackingService]);

  it('should ...',
     inject([TrackingService], (service: TrackingService) => { expect(service).toBeTruthy(); }));
});
