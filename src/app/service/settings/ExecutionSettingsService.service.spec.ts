/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExecutionSettingsServiceService } from './ExecutionSettingsService.service';

describe('Service: ExecutionSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExecutionSettingsServiceService]
    });
  });

  it('should ...', inject([ExecutionSettingsServiceService], (service: ExecutionSettingsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
