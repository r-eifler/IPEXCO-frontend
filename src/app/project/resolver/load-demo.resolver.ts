import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadProjectDemo } from "../state/project.actions";

export const loadDemoResolver: ResolveFn<void> = (snapshot) => {

  const id = snapshot.paramMap.get('demoId');

  inject(Store).dispatch(loadProjectDemo({ id }))
}
