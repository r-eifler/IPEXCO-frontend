import { TestBed } from "@angular/core/testing";

import { PddlFileUtilsService } from "./pddl-file-utils.service";

describe("FileContentService", () => {
  let service: PddlFileUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PddlFileUtilsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
