import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadPrompt } from "../state/globalSpec.actions";

export const loadPromptResolver: ResolveFn<void> = (snapshot) => {

  const id = snapshot.paramMap.get('promptId');

  inject(Store).dispatch(loadPrompt({ id }))
}
