import { ValidatorFn } from "@angular/forms";

// export const selectedAtLeastOne: ValidatorFn = (control) => control.value
//   ?.map?.(value => !!value)
//   ?.reduce((acc, curr) => acc || curr, false)
//   ? null : { noneSelected: true };


export const selectedAtLeastOne: ValidatorFn = (control) => {
  if(!!control.value){
    return null;
  }
  
  if(!Array.isArray(control.value)){
    return null
  }
  
  const values = control.value as Array<any>;

  if(values.length > 0){
    return null;
  }

  return { noneSelected: true };
}