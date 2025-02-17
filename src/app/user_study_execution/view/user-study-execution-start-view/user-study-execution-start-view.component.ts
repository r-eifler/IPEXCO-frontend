import {Component, inject} from '@angular/core';
import {PageModule} from '../../../shared/components/page/page.module';
import {Store} from '@ngrx/store';
import {selectExecutionUserStudy} from '../../state/user-study-execution.selector';
import {AsyncPipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-user-study-execution-start-view',
    imports: [
        PageModule,
        AsyncPipe,
        MatButtonModule,
        RouterLink,
        InfoComponent,
        MatIconModule
    ],
    templateUrl: './user-study-execution-start-view.component.html',
    styleUrl: './user-study-execution-start-view.component.scss'
})
export class UserStudyExecutionStartViewComponent {

  store = inject(Store);

  userStudy$ = this.store.select(selectExecutionUserStudy);

}
