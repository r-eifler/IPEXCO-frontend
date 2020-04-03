import { TestBed } from '@angular/core/testing';

import { ObjectCollectionService } from './object-collection.service';

describe('PlanPropertyService', () => {
  let service: ObjectCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
