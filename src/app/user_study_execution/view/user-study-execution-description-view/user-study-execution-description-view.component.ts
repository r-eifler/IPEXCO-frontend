import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {Store} from '@ngrx/store';
import {PageModule} from '../../../shared/components/page/page.module';
import {MarkedPipe} from '../../../pipes/marked.pipe';


@Component({
  selector: 'app-user-study-execution-description-view',
  standalone: true,
  imports: [
    AsyncPipe,
    PageModule,
    PageTitleComponent,
    MarkedPipe
  ],
  templateUrl: './user-study-execution-description-view.component.html',
  styleUrl: './user-study-execution-description-view.component.scss'
})
export class UserStudyExecutionDescriptionViewComponent {

  store = inject(Store);
  step$ = this.store.select(selectExecutionUserStudyStep);
}
