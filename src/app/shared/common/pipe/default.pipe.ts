import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'default',
  standalone: true
})
export class DefaultPipe implements PipeTransform {

  transform<T, U>(value: T | undefined | null, defaultValue: U): T | U {
    if(value === null || value === undefined) {
      return defaultValue;
    }

    return value;
  }
}
