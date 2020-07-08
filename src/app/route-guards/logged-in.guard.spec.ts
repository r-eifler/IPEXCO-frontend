import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth-guard.guard';

describe('LoggedInGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
