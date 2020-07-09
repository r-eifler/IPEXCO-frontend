import {TestBed} from '@angular/core/testing';

import {ExecutionSettingsService} from './execution-settings.service';

describe('ExecutionSettingsService', () => {
  let service: ExecutionSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
