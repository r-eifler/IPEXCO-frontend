import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadFlightPlanTree, loadProject } from "../state/flight-section-planning.actions";

export const LoadFlightPlanTreeResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  let node = state.root;
  while(node != undefined){
    const id = node.paramMap.get('projectId');
    if(id != null){
      inject(Store).dispatch(loadFlightPlanTree({ projectId: id }))
      return;
    }
    node = node.children[0];
  }

}
