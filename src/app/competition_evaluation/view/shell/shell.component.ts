import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadEvaluationInstances } from '../../state/competition_evaluation.actions';



@Component({
    selector: 'app-shell',
    imports: [RouterOutlet, MatSidenavModule, MatButtonModule],
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss'
})
export class ShellComponent {

    store = inject(Store);

    constructor() {
        this.store.dispatch(loadEvaluationInstances());
    }

}
