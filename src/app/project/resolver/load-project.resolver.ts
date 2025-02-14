import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadProject } from "../state/project.actions";

export const loadProjectResolver: ResolveFn<void> = (snapshot) => {

  const id = snapshot.paramMap.get('projectId');

  if(id != null)
    inject(Store).dispatch(loadProject({ id }))
}
