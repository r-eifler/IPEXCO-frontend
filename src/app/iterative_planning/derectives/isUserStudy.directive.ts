import { NgIf } from '@angular/common';
import { Directive, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {selectUser} from '../../user/state/user.selector';

@Directive({
    selector: '[isUserStudy]',
    standalone: true,
    hostDirectives: [{
        directive: NgIf,
    }],
})
export class UserStudyDirective {

    store = inject(Store);

    user = toSignal(this.store.select(selectUser));

    constructor(ngIf: NgIf) {
        effect(() => {
            ngIf.ngIf = this.user().role === 'user-study'
        });
    }
}
