import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Store } from "@ngrx/store";
import { loadDomainSpecification } from "../state/globalSpec.actions";

export const loadDomainSpecResolver: ResolveFn<void> = (snapshot) => {

  const id = snapshot.paramMap.get('domainSpecId');

  inject(Store).dispatch(loadDomainSpecification({ id }))
}
