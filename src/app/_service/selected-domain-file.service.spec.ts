import { TestBed } from '@angular/core/testing';

import { SelectedDomainFileService } from './selected-domain-file.service';

describe('SelectedDomainFileService', () => {
  let service: SelectedDomainFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedDomainFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
