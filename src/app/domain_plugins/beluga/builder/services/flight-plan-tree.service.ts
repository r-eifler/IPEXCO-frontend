import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { FlightSection, FlightSectionBase, FlightSectionZ } from "../../flight-section-planning/domain/flight-section";


@Injectable()
export class FlightPlanTreeService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "flight-plan-forest/";

  
    getSectionById$(id: string): Observable<FlightSection> {
      return this.http.get<unknown>(this.BASE_URL + 'section/' + id).pipe(
          map(data => FlightSectionZ.parse(data)),
      )
    }

    postSection$(section: FlightSectionBase): Observable<FlightSection> {
      return this.http.post<unknown>(this.BASE_URL + 'section', section).pipe(
        map(data => FlightSectionZ.parse(data)),
      )
    }
    
}