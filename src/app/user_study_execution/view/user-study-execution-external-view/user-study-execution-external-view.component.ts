import {Component, inject, output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatAnchor, MatButton} from '@angular/material/button';
import {PageComponent} from '../../../shared/components/page/page/page.component';
import {PageContentComponent} from '../../../shared/components/page/page-content/page-content.component';
import {PageSectionComponent} from '../../../shared/components/page/page-section/page-section.component';
import {PageSectionContentComponent} from '../../../shared/components/page/page-section-content/page-section-content.component';
import {PageSectionListComponent} from '../../../shared/components/page/page-section-list/page-section-list.component';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {Store} from '@ngrx/store';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';

@Component({
  selector: 'app-user-study-execution-external-view',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    PageComponent,
    PageContentComponent,
    PageSectionComponent,
    PageSectionContentComponent,
    PageSectionListComponent,
    PageTitleComponent,
    MatAnchor
  ],
  templateUrl: './user-study-execution-external-view.component.html',
  styleUrl: './user-study-execution-external-view.component.scss'
})
export class UserStudyExecutionExternalViewComponent {

  store = inject(Store);
  step$ = this.store.select(selectExecutionUserStudyStep);

  continue = output<void>();

  clickedLink = false;

  onClickLink(){
    this.clickedLink = true;
  }

  onContinue() {
    console.log('External Link Continue');
    this.continue.emit();
  }

}
