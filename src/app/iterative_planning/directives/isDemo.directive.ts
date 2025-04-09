import { NgIf } from "@angular/common";
import { Directive, effect, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { selectIterativePlanningIsDemo } from "../state/iterative-planning.selector";

@Directive({
    selector: '[isDemo]',
    standalone: true,
    hostDirectives: [{
        directive: NgIf,
    }],
})
export class DemoDirective {

    store = inject(Store);

    isDemo = toSignal(this.store.select(selectIterativePlanningIsDemo));

    constructor(ngIf: NgIf) {
        effect(() => {
            ngIf.ngIf = this.isDemo()
        });
    }
}