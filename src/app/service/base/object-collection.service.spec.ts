import { TestBed } from "@angular/core/testing";

import { ObjectCollectionService } from "./object-collection.service";
import { PlanProperty } from "../../iterative_planning/domain/plan-property/plan-property";

describe("PlanPropertyService", () => {
  let service: ObjectCollectionService<PlanProperty>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectCollectionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
