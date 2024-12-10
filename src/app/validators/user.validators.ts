import { UntypedFormGroup, ValidationErrors } from "@angular/forms";

export const passwordValidator = (control: UntypedFormGroup): ValidationErrors | null => {
  if(! control.get("password") || ! control.get("passwordRepeat")) {
    return null
  }
  const pass = control.get("password")?.value;
  const confirmPass = control.get("passwordRepeat")?.value;

  return pass === confirmPass ? null : { notSame: true };
};
