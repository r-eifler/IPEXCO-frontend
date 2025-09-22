import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectTestCase } from "../state/policy-testing.actions";

export const SelectTestCaseResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  let node = state.root;
  while(node != undefined){
    console.log(node.paramMap.get('testCaseIndex'))
    const id = node.paramMap.get('testCaseIndex');
    if(id != null){
      const index =  Number(id)
      inject(Store).dispatch(selectTestCase({ testCaseID: index }))
      return;
    }
    node = node.children[0];
  }

}