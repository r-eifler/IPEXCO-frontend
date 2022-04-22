import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const pass = control.get("password").value;
  const confirmPass = control.get("passwordRepeat").value;

  return pass === confirmPass ? null : { notSame: true };
};
