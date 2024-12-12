import {inject, Pipe, PipeTransform, SecurityContext} from '@angular/core';
import * as marked from 'marked';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'marked',
  standalone: true,
})
export class MarkedPipe implements PipeTransform {
  domSanitizer = inject(DomSanitizer);

  transform(value: string, ...args: unknown[]): unknown {
    if (value && value.length > 0) {
      const sanitizedValue = this.domSanitizer.sanitize(SecurityContext.HTML, marked.marked(value));
      return sanitizedValue;
    }
    return value;
  }
}
