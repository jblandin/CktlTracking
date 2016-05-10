import {beforeEachProviders, it, describe, expect, inject} from '@angular/core/testing';
import {TrackingService} from './tracking.service';
import {HTTP_PROVIDERS} from '@angular/http';

describe('Tracking Service', () => {
  beforeEachProviders(() => [TrackingService, HTTP_PROVIDERS]);

  it('should exist',
    inject([TrackingService], (service: TrackingService) => {
      expect(service).toBeTruthy();
    })
  );
});
