import { ValidatorFn } from "@angular/forms";

export const selectedAtLeastOne: ValidatorFn = (control) => control.value
  ?.map?.(value => !!value)
  ?.reduce((acc, curr) => acc || curr, false)
  ? null : { noneSelected: true };
