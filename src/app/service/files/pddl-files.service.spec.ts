import {TestBed} from '@angular/core/testing';
import { Domainfile.ServiceService } from './domainfile.service.service';

describe('Domainfile.ServiceService', () => {
  let service: Domainfile.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Domainfile.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
