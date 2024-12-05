import { NgIf } from "@angular/common";
import { Directive, effect, inject, input } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { UserRole } from "src/app/user/domain/user";
import { selectUserRole } from "src/app/user/state/user.selector";

@Directive({
    selector: '[userRole]',
    standalone: true,
    hostDirectives: [{
        directive: NgIf,
    }],
})
export class UserRoleDirective {
    userRole = input.required<UserRole[]>({ alias: 'userRole' });

    store = inject(Store);

    currentRole = toSignal(this.store.select(selectUserRole)); // -> 'admin', ...

    constructor(ngIf: NgIf) {
        console.log(this.currentRole());
        effect(() => ngIf.ngIf = this.userRole().includes(this.currentRole()));
    }
}