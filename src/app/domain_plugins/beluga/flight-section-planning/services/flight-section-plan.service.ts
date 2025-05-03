import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { BelugaProblem } from "../../shared/domain/beluga_problem";
import { FlightSection, FlightSectionZ, projectTaskToSection } from "../domain/flight-section";
import { PlanMethod } from "../domain/plan_method";


@Injectable()
export class FlightSectionPlanService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "flight-section-plan/";

    postPlanRequest$(section: FlightSection, method: PlanMethod, baseTask: BelugaProblem): Observable<FlightSection> {

      let projection = projectTaskToSection(baseTask, section);
      console.log(projection);

      let data = {
        section: {
          ...section,
          planMethod: method, 
        },
        task: projection
      }

      return this.http.post<unknown>(this.BASE_URL, data).pipe(
        map(data => FlightSectionZ.parse(data)),
      )
    }

    
}