import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadFlightSection } from "../state/builder.actions";

export const LoadFlightSectionResolver: ResolveFn<void> = (snapshot) => {

  const id = snapshot.paramMap.get('sectionId');

  if(id != null)
    inject(Store).dispatch(loadFlightSection({ id }))
}
