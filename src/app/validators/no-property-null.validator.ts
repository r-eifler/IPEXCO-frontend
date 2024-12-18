import { ValidatorFn } from '@angular/forms';


export const isNoPropertyNull: ValidatorFn = (control) =>{
  return (Object.values(control?.value)?.some(e => e === undefined)) ? { propertyNull: true} : null;
}

