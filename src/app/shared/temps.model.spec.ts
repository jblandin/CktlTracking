import {
  describe,
  ddescribe,
  expect,
  iit,
  it
} from '@angular/core/testing';
import {Temps} from './temps.model';

describe('Temps', () => {
  it('should create an instance', () => {
    expect(new Temps()).toBeTruthy();
  });
});
