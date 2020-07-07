import { TestBed } from '@angular/core/testing';

import { UserStudyUserService } from './user-study-user.service';

describe('UserStudyUserService', () => {
  let service: UserStudyUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStudyUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
