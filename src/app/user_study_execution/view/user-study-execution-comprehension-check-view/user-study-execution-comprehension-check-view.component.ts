import {FormsModule} from '@angular/forms';
import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {Store} from '@ngrx/store';
import {PageModule} from '../../../shared/components/page/page.module';
import {MarkedPipe} from '../../../pipes/marked.pipe';
import {AllowUrlPipe} from 'src/app/project/service/allow-url.service';


@Component({
    selector: 'app-user-study-execution-comprehension-check-view',
    imports: [
        FormsModule,
        AsyncPipe,
        PageModule,
        PageTitleComponent,
        MarkedPipe,
        AllowUrlPipe
    ],
    templateUrl: './user-study-execution-comprehension-check-view.component.html',
    styleUrl: './user-study-execution-comprehension-check-view.component.scss'
})
export class UserStudyExecutionComprehensionCheckViewComponent {
  store = inject(Store);
  step$ = this.store.select(selectExecutionUserStudyStep);

  answers = {
    q1: '',
    q2: '',
    q3: ''
  };

  onSubmit() {
    console.log('Answers:', this.answers);

    // Example: Access individual answers
    console.log('Question 1:', this.answers.q1);
    console.log('Question 2:', this.answers.q2);
    console.log('Question 3:', this.answers.q3);
  }

}
