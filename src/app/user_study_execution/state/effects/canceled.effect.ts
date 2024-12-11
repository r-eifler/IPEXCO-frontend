import { inject, Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import {selectExecutionUserStudyCanceled} from '../user-study-execution.selector';
import {Router} from '@angular/router';


@Injectable()
export class UserStudyCanceledEffect{

    private store = inject(Store);
    private router = inject(Router);

    public canceled$ = createEffect(() => this.store.select(selectExecutionUserStudyCanceled).pipe(
        tap(isCanceled => console.log('Cancel Status: ' + isCanceled)),
        tap((isCanceled) => {
            if(isCanceled){
              this.router.navigate(['user-study-execution', 'canceled'])
            }
        })
      ), {dispatch: false}
    )
}
