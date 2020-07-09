import {TestBed} from '@angular/core/testing';

import {DomainSpecificationService} from './domain-specification.service';

describe('DomainSpecificationService', () => {
  let service: DomainSpecificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DomainSpecificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
