import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";

export const loadProjectResolver: ResolveFn<void> = (snapshot) => {
  // inject(Store).dispatch(loadProject({ id }))
}
