import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { FlightsHorizon, FlightsHorizonBase, FlightsHorizonZ } from "../../flight-section-planning/domain/flight-section";


@Injectable()
export class FlightPlanTreeService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "flight-plan-forest/";

  
    getSectionById$(id: string): Observable<FlightsHorizon> {
      return this.http.get<unknown>(this.BASE_URL + 'section/' + id).pipe(
          map(data => FlightsHorizonZ.parse(data)),
      )
    }

    postSection$(section: FlightsHorizonBase): Observable<FlightsHorizon> {
      return this.http.post<unknown>(this.BASE_URL + 'section', section).pipe(
        map(data => FlightsHorizonZ.parse(data)),
      )
    }

    putSection$(section: FlightsHorizon): Observable<FlightsHorizon> {
      return this.http.put<unknown>(this.BASE_URL + 'section/' + section._id, section).pipe(
        map(data => FlightsHorizonZ.parse(data)),
      )
    }
    
}