import { TestBed } from '@angular/core/testing';

import { DisplayTaskService } from './display-task.service';

describe('DisplayTaskService', () => {
  let service: DisplayTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
