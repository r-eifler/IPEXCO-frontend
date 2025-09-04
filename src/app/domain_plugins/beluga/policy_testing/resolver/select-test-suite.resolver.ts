import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectTestSuite } from "../state/policy-testing.actions";

export const SelectTestSuiteResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  let node = state.root;
  while(node != undefined){
    const id = node.paramMap.get('testId');
    if(id != null){
      inject(Store).dispatch(selectTestSuite({ testSuiteId: id }))
      return;
    }
    node = node.children[0];
  }

}