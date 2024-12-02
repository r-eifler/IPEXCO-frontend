import { NgIf } from "@angular/common";
import { Directive, effect, inject, input, TemplateRef } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";

type User = 'admin' | 'user';

@Directive({
    selector: '[userRole]',
    hostDirectives: [{
        directive: NgIf,
    }],
})
class UserRoleDirective {
    showForUser = input.required<User[]>({ alias: 'userRole' });

    store = inject(Store);

    currentRole = toSignal(this.store.select(selectCurrentRole)); // -> 'admin', ...

    constructor(ngIf: NgIf) {
      effect(() => ngIf.ngIf = this.showForUser().includes(this.currentRole()));
    }
}