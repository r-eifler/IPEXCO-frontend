import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";

import { loadProject } from "../state/iterative-planning.actions";

export const loadProjectResolver: ResolveFn<void> = (snapshot) => {
  const id = snapshot.paramMap.get('projectId');

  inject(Store).dispatch(loadProject({ id }))
}
