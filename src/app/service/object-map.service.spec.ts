import { TestBed } from '@angular/core/testing';

import { ObjectMapService } from './object-map.service';

describe('ObjectMapService', () => {
  let service: ObjectMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
