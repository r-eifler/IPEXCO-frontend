import { AbstractControl, ValidatorFn } from "@angular/forms";


export const jsonValidator: ValidatorFn = (control) => {
    try{
        JSON.parse(control.value);
    } catch(e) {
        return { invalidJson: true };
    }
};