import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


/**
 * Allows a URL to be used for an iframe.
 *
 * SECURITY WARNING:
 * this does no checks, it just says "this URL is safe." DO NOT USE THIS UNLESS YOU 100% TRUST THE
 * INPUTTER.
 *
 */
@Pipe({ name: 'allowUrl' })
export class AllowUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
