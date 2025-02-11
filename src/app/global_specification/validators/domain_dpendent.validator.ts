import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { Encoding, ServiceType } from "../domain/services";

export const domainOnlyForDomainDependentEncoding: ValidatorFn = (
    control: AbstractControl,): ValidationErrors | null => {

    const encoding = control.get('encoding');
    const domainId = control.get('domainId');

    return encoding && encoding.value == Encoding.DOMAIN_DEPENDENT && domainId && !domainId.value 
        ? { missingDomain: true }
        : null;

  };