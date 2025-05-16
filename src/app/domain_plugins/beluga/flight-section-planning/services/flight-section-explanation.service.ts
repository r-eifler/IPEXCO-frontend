import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { boolean } from "zod";
import { FlightSection, FlightSectionZ } from "../domain/flight-section";


@Injectable()
export class FlightSectionExplanationService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "flight-section-explanation/";

    postExplanationRequest$(section: FlightSection): Observable<FlightSection> {

      let data = {
        section
      }

      return this.http.post<unknown>(this.BASE_URL, data).pipe(
        map(data => FlightSectionZ.parse(data)),
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