import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {UserStudyExecutionProgressComponent} from '../../components/user-study-execution-progress/user-study-execution-progress.component';
import {UserStudyExecutionHandlerComponent} from '../../components/user-study-execution-handler/user-study-execution-handler.component';
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
    selector: 'app-shell',
    imports: [
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        UserStudyExecutionProgressComponent,
        UserStudyExecutionHandlerComponent,
        MatSidenavModule
    ],
    templateUrl: './user-study-execution-shell.component.html',
    styleUrl: './user-study-execution-shell.component.scss'
})
export class UserStudyExecutionShellComponent {

  store = inject(Store);

}
