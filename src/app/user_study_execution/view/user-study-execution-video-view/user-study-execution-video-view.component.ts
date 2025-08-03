import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {Store} from '@ngrx/store';
import {PageModule} from '../../../shared/components/page/page.module';
import {MarkedPipe} from '../../../pipes/marked.pipe';
import {AllowUrlPipe} from 'src/app/project/service/allow-url.service';


@Component({
    selector: 'app-user-study-execution-video-view',
    imports: [
        AsyncPipe,
        PageModule,
        PageTitleComponent,
        MarkedPipe,
        AllowUrlPipe
    ],
    templateUrl: './user-study-execution-video-view.component.html',
    styleUrl: './user-study-execution-video-view.component.scss'
})
export class UserStudyExecutionVideoViewComponent {
  store = inject(Store);
  step$ = this.store.select(selectExecutionUserStudyStep);
}
