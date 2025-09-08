import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array } from "zod";
import { BelugaSiteSetUp, BelugaSiteState } from "../../shared/domain/site_set_up";
import { FlightPlanTree, FlightPlanTreeZ, FlightsHorizon, FlightsHorizonZ, FlightTargetSchedule, ProductionLineTargetSchedule } from "../../flight-section-planning/domain/flight-section";



interface initData {
  projectId: string, 
  siteState: BelugaSiteState,
  siteSetUp: BelugaSiteSetUp,
  flightTargetSchedule: FlightTargetSchedule,
  productionLinesTargetSchedule: ProductionLineTargetSchedule[],
}

@Injectable()
export class TestingFlightPlanTreeService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "flight-plan-forest/";

    
    getTree$(projectId: string): Observable<FlightPlanTree> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', projectId);

        return this.http.get<unknown>(this.BASE_URL,  { params: httpParams }).pipe(
            map(data => FlightPlanTreeZ.parse(data)),
        )
    }

    getSections$(treeId: string): Observable<Record<string,FlightsHorizon>> {

      let httpParams = new HttpParams();
      httpParams = httpParams.set('treeId', treeId);

      return this.http.get<unknown>(this.BASE_URL + 'section/',  { params: httpParams }).pipe(
          map(data => array(FlightsHorizonZ).parse(data)),
          map(sections => sections.reduce((acc, c) => ({...acc,[c._id]: c}), {}))
      )
    }
    
}