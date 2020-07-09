import {TestBed} from '@angular/core/testing';

import {TaskSchemaService} from './schema.service';

describe('SchemaService', () => {
  let service: TaskSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskSchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
