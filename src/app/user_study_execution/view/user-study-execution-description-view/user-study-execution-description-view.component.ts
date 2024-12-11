import {Component, inject, output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {Store} from '@ngrx/store';
import {PageModule} from '../../../shared/components/page/page.module';
import {executionUserStudyCancel} from '../../state/user-study-execution.actions';
import {AskDeleteComponent} from '../../../shared/components/ask-delete/ask-delete.component';
import {deleteProjectDemo} from '../../../project/state/project.actions';
import {MatDialog} from '@angular/material/dialog';

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
  dialog = inject(MatDialog);

  step$ = this.store.select(selectExecutionUserStudyStep);

  continue = output<void>();

  onContinue() {
    console.log('Description Continue');
    this.continue.emit();
  }

  onCancel() {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {
        name: 'Cancel User Study',
        text: 'Are you sure you want to cancel the user study? By clicking the cancel button all data related to this run will be delete.',
        buttonAgree: 'Cancel',
        buttonDisagree: 'Continue with user study'
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.store.dispatch(executionUserStudyCancel());
      }
    });
  }

}
