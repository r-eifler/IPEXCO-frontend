import { AbstractControl, ValidatorFn } from "@angular/forms";

export function matchRegexValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const allowed = nameRe.test(control.value);
    return !allowed ? { forbiddenName: { value: control.value } } : null;
  };
}
