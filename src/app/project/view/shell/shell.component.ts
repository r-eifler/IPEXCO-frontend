import { Component, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-user-study-shell',
    imports: [RouterOutlet],
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss'
})
export class ShellComponent {

}
