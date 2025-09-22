import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { ExplanationRunStatus } from "src/app/iterative_planning/domain/explanation/explanations";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { environment } from "src/environments/environment";
import { array } from "zod";
import { BelugaProblem, Flight } from "../../shared/domain/beluga_problem";
import { applyActions, getInitialSiteState } from "../../shared/domain/beluga_state";
import { BelugaSiteState, getSiteSetUp } from "../../shared/domain/site_set_up";
import { BelugaConfiguration, deriveSuccessorFlightHorizonFromPredecessor, filterUpTo, FlightPlanTree, FlightPlanTreeBase, FlightPlanTreeZ, FlightsHorizon, FlightsHorizonBase, FlightsHorizonData, FlightsHorizonZ, getBranchOfFlightHorizon, getConsideredFlightSchedule, getFullStartState, getJigsOnSiteFromState, getPrefixOfFlightHorizon, getProductionSchedule, initialDeliveryStatuses } from "../domain/flight-section";


interface initData {
  projectId: string, 
  section: FlightsHorizonData
}

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

    getSectionById$(id: string): Observable<FlightsHorizon> {
      return this.http.get<unknown>(this.BASE_URL + 'section/' + id).pipe(
          map(data => FlightsHorizonZ.parse(data)),
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


    postTree$(tree: FlightPlanTreeBase): Observable<FlightPlanTree> {
      return this.http.post<unknown>(this.BASE_URL, tree).pipe(
        map(data => FlightPlanTreeZ.parse(data)),
      )
    }

    initTree$(projectId: string, task: BelugaProblem): Observable<FlightPlanTree> {

      const siteState = getInitialSiteState(task);
      const siteSetUp = getSiteSetUp(task);
      const flights = task.flights;

      const jigsOnSite = getJigsOnSiteFromState(siteState, flights)
      const jigTypesOnSite = [...jigsOnSite].map(jn => task.jigs[jn].type)


      const flightTargetSchedule = flights.reduce((acc, flight,index) => ({
          ...acc,
          [index]: {
            originalIndex: index,
            name: flight.name,
            incoming: flight.incoming.map(jn => ({
              jig: jn, 
              skip: false,
            })),
            outgoing: flight.outgoing.map(jt => {
              const index = jigTypesOnSite.findIndex(t => t === jt);
              if(index !== -1){
                  jigTypesOnSite.splice(index,1)
              }
              return { 
                  jigType: jt, 
                  skip: false,
                  onSite: index !== -1,
              }
            }) 
          }
        }
      ), {})

      const productionLinesTargetSchedule = task.production_lines.reduce((acc,pl) => {
          const notBlocked = filterUpTo(pl.schedule, jigsOnSite);
          return {
            ...acc,
            [pl.name]: {
              name: pl.name,
              schedule: pl.schedule.map(jn => ({
                jig: jn, 
                ...initialDeliveryStatuses(jn, jigsOnSite, notBlocked),
              }))
            }
          }
        }, {})

      const section: FlightsHorizonData = {
        predecessorId: null,
        status: PlanRunStatus.PENDING,
        flightIndices: flights.map((f,i) => i),
        siteState,
        configurationIndex: 0,
        configurations: [{
                siteSetUp,
                flightTargetSchedule,
                productionLinesTargetSchedule,
                maxSwaps: null,
                minEmptyRacks: 0,
                explanations: null,
                explanationStatus: ExplanationRunStatus.PENDING,
            }] as BelugaConfiguration[],
        actions: [],
        finished: false
      }

      const data: initData = {
        projectId, 
        section
      }

      return this.http.post<unknown>(this.BASE_URL + 'init', data).pipe(
        map(data => FlightPlanTreeZ.parse(data)),
      )
    }

    newBranch$(branchOfSection: FlightsHorizon, branchName: string, allFlights: Flight[] | undefined, prefix: number[], horizon: number[]): Observable<FlightPlanTree| undefined> {

      if(allFlights === undefined){
          return of(undefined);
      }

      let prefixSection: FlightsHorizonBase | null | undefined = null;
      const baseConfiguration = branchOfSection.configurations[branchOfSection.configurationIndex];

      if(prefix.length > 0){
        prefixSection = getPrefixOfFlightHorizon(branchOfSection, prefix);  
        if(prefixSection === undefined){
          return of(undefined);
        }
      }

      // new initial state
      let siteState: BelugaSiteState | undefined = undefined;
      if(prefixSection === null){
        siteState = branchOfSection.siteState;
      }
      else{
        
        const fullInitialState = applyActions(
            getFullStartState(branchOfSection), 
            prefixSection.actions, 
            getConsideredFlightSchedule(baseConfiguration.flightTargetSchedule, branchOfSection.flightIndices),  
            getProductionSchedule(Object.values(baseConfiguration.productionLinesTargetSchedule) ?? [],false) , 
            baseConfiguration.siteSetUp
        );
        if(fullInitialState === undefined){
          return of(undefined);
        }
        siteState = fullInitialState; // Question are the additional properties cut of?
      }

      if(siteState === undefined){
          return of(undefined);
        }

      let nextSection: FlightsHorizonBase | undefined | null = null;

      if(prefixSection !== null){
        nextSection = deriveSuccessorFlightHorizonFromPredecessor(prefixSection, allFlights, horizon)
      }
      else{
        nextSection = getBranchOfFlightHorizon(branchOfSection, allFlights, horizon)
      }

      if(nextSection === undefined){
          return of(undefined);
        }

      return this.http.post<unknown>(this.BASE_URL + 'branch', {branchName, prefixSection, nextSection}).pipe(
        map(data => FlightPlanTreeZ.parse(data)),
      )
    }

    postSection$(section: FlightsHorizonBase): Observable<FlightsHorizon> {
      return this.http.post<unknown>(this.BASE_URL + 'section', section).pipe(
        map(data => FlightsHorizonZ.parse(data)),
      )
    }

    putTree$(tree: FlightPlanTree): Observable<FlightPlanTree> {
      return this.http.put<unknown>(this.BASE_URL + tree._id, tree).pipe(
        map(data => FlightPlanTreeZ.parse(data)),
      )
    }

    putSection$(section: FlightsHorizon): Observable<FlightsHorizon> {
      return this.http.put<unknown>(this.BASE_URL + 'section/' + section._id, section).pipe(
        map(data => FlightsHorizonZ.parse(data)),
      )
    }

    addConfiguration$(section: FlightsHorizon, config: BelugaConfiguration): Observable<FlightsHorizon> {
      let newSection: FlightsHorizon = {
        ...section,
        configurations: [...section.configurations, config],
        configurationIndex: section.configurations.length,
      }
      return this.http.put<unknown>(this.BASE_URL + 'section/' + section._id, newSection).pipe(
        map(data => FlightsHorizonZ.parse(data)),
      )
    }

    changeUsedConfiguration$(section: FlightsHorizon, index: number): Observable<FlightsHorizon> {
      let newSection: FlightsHorizon = {
        ...section,
        configurationIndex: index,
      }
      return this.http.put<unknown>(this.BASE_URL + 'section/' + section._id, newSection).pipe(
        map(data => FlightsHorizonZ.parse(data)),
      )
    }
    
}