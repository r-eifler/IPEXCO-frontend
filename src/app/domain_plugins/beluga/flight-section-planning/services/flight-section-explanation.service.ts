import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { boolean } from "zod";
import { FlightsHorizon, FlightsHorizonZ } from "../domain/flight-section";


@Injectable()
export class FlightsHorizonExplanationService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "flight-section-explanation/";

    postExplanationRequest$(section: FlightsHorizon, configIndex: number): Observable<FlightsHorizon> {

      let data = {
        section,
        configIndex,
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