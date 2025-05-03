import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectSection } from "../state/flight-section-planning.actions";


@Injectable({ providedIn: 'root' })
export class SelectSectionResolver implements Resolve<string | null> {
  constructor(private store: Store) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): string | null {
    const id = route.paramMap.get('sectionId');

    if(id != null)
      this.store.dispatch(selectSection({ id }))
    
    return id
  }
}