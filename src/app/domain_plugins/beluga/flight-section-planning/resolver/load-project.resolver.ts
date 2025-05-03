import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadProject } from "../state/flight-section-planning.actions";


@Injectable({ providedIn: 'root' })
export class LoadProjectResolver implements Resolve<string | null> {
  constructor(private store: Store) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): string | null {
    const id = route.paramMap.get('projectId');

    if(id != null)
      this.store.dispatch(loadProject({ id }))
    
    return id
  }
}