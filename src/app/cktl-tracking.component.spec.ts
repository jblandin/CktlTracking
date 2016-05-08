import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { CktlTrackingAppComponent } from '../app/cktl-tracking.component';

beforeEachProviders(() => [CktlTrackingAppComponent]);

describe('App: CktlTracking', () => {
  it('should create the app',
      inject([CktlTrackingAppComponent], (app: CktlTrackingAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'cktl-tracking works!\'',
      inject([CktlTrackingAppComponent], (app: CktlTrackingAppComponent) => {
    expect(app.title).toEqual('cktl-tracking works!');
  }));
});
