import {
  GoalType,
  PlanProperty,
} from "src/app/interface/plan-property/plan-property";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { PDDLFile } from "../../interface/files/files";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { IHTTPData } from "../../interface/http-data.interface";
import { map } from "rxjs/operators";
import { DomainSpecification } from "../../interface/files/domain-specification";
import { DomainSpecificationService } from "./domain-specification.service";
import { Project } from "../../interface/project";

interface FileContent {
  data: string;
}

const BASE_URL = environment.apiURL + "pddl-file/";

@Injectable({
  providedIn: "root",
})
export class PddlFileUtilsService {
  domainSpec: DomainSpecification;

  constructor(
    private http: HttpClient,
    private domainSpecService: DomainSpecificationService
  ) {
    domainSpecService.getSpec().subscribe((spec) => (this.domainSpec = spec));
  }

  getFileContent(path: string): Observable<string> {
    if (path !== undefined) {
      const url = environment.srcURL + path;
      return this.http.get(url, { responseType: "text" });
    } else {
      throw Error("path for file content in undefined");
    }
  }

  getGoalFacts(project: Project, file: PDDLFile): Observable<PlanProperty[]> {
    return this.http
      .get<IHTTPData<string[]>>(`${BASE_URL}/${file._id}/goal-facts`)
      .pipe(
        map((value) => {
          const goalFacts: PlanProperty[] = [];
          for (const g of value.data) {
            const goal: PlanProperty = {
              name: g,
              type: GoalType.goalFact,
              formula: g,
              project: project._id,
              isUsed: false,
              globalHardGoal: false,
              value: 1,
            };
            this.domainSpec?.getGoalDescription(goal);
            goalFacts.push(goal);
          }
          return goalFacts;
        })
      );
  }
}
