import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[animation-settings-host]',
})
export class AnimationSettingsDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
