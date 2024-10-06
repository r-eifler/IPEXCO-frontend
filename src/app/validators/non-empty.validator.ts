import { ValidatorFn } from "@angular/forms";

export const isNonEmptyValidator: ValidatorFn = (control) => (control?.value?.length > 0) ? null : { empty: true};
