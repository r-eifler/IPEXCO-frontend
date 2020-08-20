import { TestBed } from '@angular/core/testing';

import { TimeLoggerService } from './time-logger.service';

describe('TimeLoggerService', () => {
  let service: TimeLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
