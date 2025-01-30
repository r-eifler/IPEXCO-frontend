import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadOutputSchema } from "../state/globalSpec.actions";

export const loadOutputSchemaResolver: ResolveFn<void> = (snapshot) => {

  const id = snapshot.paramMap.get('schemaId');

  inject(Store).dispatch(loadOutputSchema({ id }))
}
