import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { boolean } from "zod";
import { FlightsHorizon, FlightsHorizonZ } from "../domain/flight-section";
import { PlanMethod } from "../domain/plan_method";


@Injectable()
export class FlightsHorizonPlanService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "flight-section-plan/";

    postPlanRequest$(section: FlightsHorizon, method: PlanMethod): Observable<FlightsHorizon> {

      let data = {
        section: {
          ...section,
          planMethod: method, 
        },
      }

      return this.http.post<unknown>(this.BASE_URL, data).pipe(
        map(data => FlightsHorizonZ.parse(data)),
      )
    }

    cancel$(sectionId: string): Observable<boolean> {

      let data = {
        sectionId
      }

      return this.http.post<unknown>(this.BASE_URL + 'cancel', data).pipe(
        map(data => boolean().parse(data)),
      )
    }

    
}