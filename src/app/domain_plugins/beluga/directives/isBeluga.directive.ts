import { NgIf } from "@angular/common";
import { Directive, effect, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { selectIterativePlanningDomainSpecification } from "src/app/iterative_planning/state/iterative-planning.selector";

@Directive({
    selector: '[isBeluga]',
    standalone: true,
    hostDirectives: [{
        directive: NgIf,
    }],
})
export class BelugaDirective {

    store = inject(Store);

    domainSpec = toSignal(this.store.select(selectIterativePlanningDomainSpecification));

    constructor(ngIf: NgIf) {
        effect(() => {
            ngIf.ngIf = this.domainSpec()?.name.includes('Beluga')
        });
    }
}