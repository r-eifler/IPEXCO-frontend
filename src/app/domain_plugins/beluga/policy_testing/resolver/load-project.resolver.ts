import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadProject } from "../state/policy-testing.actions";

export const LoadProjectResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  let node = state.root;
  while(node != undefined){
    const id = node.paramMap.get('projectId');
    if(id != null){
      inject(Store).dispatch(loadProject({ id }))
      return;
    }
    node = node.children[0];
  }

}