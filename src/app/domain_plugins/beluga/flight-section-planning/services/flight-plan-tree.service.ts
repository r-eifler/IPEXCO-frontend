import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { array } from "zod";
import { FlightPlanTree, FlightPlanTreeBase, FlightPlanTreeZ, FlightSection, FlightSectionBase, FlightSectionZ } from "../domain/flight-section";
import { BelugaState } from "../../shared/domain/beluga_state";
import { BelugaSiteSetUp, BelugaSiteState } from "../../shared/domain/site_set_up";


@Injectable()
export class FlightPlanTreeService{

    private http = inject(HttpClient)
    private BASE_URL = environment.apiURL + "flight-plan-forest/";

    
    getTree$(projectId: string): Observable<FlightPlanTree | null> {

        let httpParams = new HttpParams();
        httpParams = httpParams.set('projectId', projectId);

        return this.http.get<unknown>(this.BASE_URL,  { params: httpParams }).pipe(
            map(data => data !== null ? FlightPlanTreeZ.parse(data) : null),
        )
    }

    getTreeById$(id: string): Observable<FlightPlanTree> {
      return this.http.get<unknown>(this.BASE_URL + id).pipe(
          map(data => FlightPlanTreeZ.parse(data)),
      )
    }

    getSectionById$(id: string): Observable<FlightSection> {
      return this.http.get<unknown>(this.BASE_URL + 'section/' + id).pipe(
          map(data => FlightSectionZ.parse(data)),
      )
    }

    getSections$(treeId: string): Observable<Record<string,FlightSection>> {

      let httpParams = new HttpParams();
      httpParams = httpParams.set('treeId', treeId);

      return this.http.get<unknown>(this.BASE_URL + 'section/',  { params: httpParams }).pipe(
          map(data => array(FlightSectionZ).parse(data)),
          map(sections => sections.reduce((acc, c) => ({...acc,[c._id]: c}), {}))
      )
    }


    postTree$(tree: FlightPlanTreeBase): Observable<FlightPlanTree> {
      return this.http.post<unknown>(this.BASE_URL, tree).pipe(
        map(data => FlightPlanTreeZ.parse(data)),
      )
    }

    initTree$(projectId: string,  siteState: BelugaSiteState, siteSetUp: BelugaSiteSetUp): Observable<FlightPlanTree> {
      return this.http.post<unknown>(this.BASE_URL + 'init', {projectId, siteState, siteSetUp}).pipe(
        map(data => FlightPlanTreeZ.parse(data)),
      )
    }

    newBranch$(sectionId: string, branchName: string): Observable<FlightPlanTree> {
      return this.http.post<unknown>(this.BASE_URL + 'branch', {sectionId, branchName}).pipe(
        map(data => FlightPlanTreeZ.parse(data)),
      )
    }

    postSection$(section: FlightSectionBase): Observable<FlightSection> {
      return this.http.post<unknown>(this.BASE_URL + 'section', section).pipe(
        map(data => FlightSectionZ.parse(data)),
      )
    }

    putTree$(tree: FlightPlanTree): Observable<FlightPlanTree> {
      return this.http.put<unknown>(this.BASE_URL + tree._id, tree).pipe(
        map(data => FlightPlanTreeZ.parse(data)),
      )
    }

    putSection$(section: FlightSection): Observable<FlightSection> {
      return this.http.put<unknown>(this.BASE_URL + 'section/' + section._id, section).pipe(
        map(data => FlightSectionZ.parse(data)),
      )
    }

    
}