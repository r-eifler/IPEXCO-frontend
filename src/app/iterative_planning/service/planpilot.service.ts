import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import {
  PlanPilotFacetsResponse,
  PlanPilotFacetsResponseZ,
  SelectPlanPilotFacetRequest,
  StartPlanPilotSessionRequest,
  StartPlanPilotSessionResponse,
  StartPlanPilotSessionResponseZ,
} from "../domain/planpilot";

@Injectable()
export class PlanPilotService {

  private http = inject(HttpClient);
  private BASE_URL = environment.apiURL + "planpilot/";

  startSession$(request: StartPlanPilotSessionRequest): Observable<StartPlanPilotSessionResponse> {
    return this.http.post<unknown>(this.BASE_URL + "sessions", request).pipe(
      map((data) => StartPlanPilotSessionResponseZ.parse(data)),
    );
  }

  listFacets$(sessionId: string): Observable<PlanPilotFacetsResponse> {
    return this.http.post<unknown>(this.BASE_URL + "sessions/" + sessionId + "/facets/list", {}).pipe(
      map((data) => PlanPilotFacetsResponseZ.parse(data)),
    );
  }

  selectFacet$(sessionId: string, request: SelectPlanPilotFacetRequest): Observable<PlanPilotFacetsResponse> {
    return this.http.post<unknown>(this.BASE_URL + "sessions/" + sessionId + "/facets/select", request).pipe(
      map((data) => PlanPilotFacetsResponseZ.parse(data)),
    );
  }

}
