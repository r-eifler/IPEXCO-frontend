import { AbstractControl, ValidatorFn } from "@angular/forms";

export function uniqueValidation(existing: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const alreadyExists = existing.includes(control.value);
    return alreadyExists ? { notUnique: { value: control.value } } : null;
  };
}
