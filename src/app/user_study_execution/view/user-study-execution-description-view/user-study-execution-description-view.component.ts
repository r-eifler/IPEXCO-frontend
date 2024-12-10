import {Component, inject, output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {Store} from '@ngrx/store';
import {PageModule} from '../../../shared/components/page/page.module';

@Component({
  selector: 'app-user-study-execution-description-view',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    PageModule,
    PageTitleComponent
  ],
  templateUrl: './user-study-execution-description-view.component.html',
  styleUrl: './user-study-execution-description-view.component.scss'
})
export class UserStudyExecutionDescriptionViewComponent {

  store = inject(Store);
  step$ = this.store.select(selectExecutionUserStudyStep);

  continue = output<void>();

  onContinue() {
    console.log('Description Continue');
    this.continue.emit();
  }
}
