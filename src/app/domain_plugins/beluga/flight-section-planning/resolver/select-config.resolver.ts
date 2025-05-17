import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectConfiguration } from "../state/flight-section-planning.actions";


@Injectable({ providedIn: 'root' })
export class SelectConfigurationResolver implements Resolve<number | null> {
  constructor(private store: Store) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): number | null {
    const indexString = route.paramMap.get('configIndex');

    if(indexString != null){
      const index = parseInt(indexString);

      this.store.dispatch(selectConfiguration({ index }));
      return index
    }
    
    return null;
  }
}