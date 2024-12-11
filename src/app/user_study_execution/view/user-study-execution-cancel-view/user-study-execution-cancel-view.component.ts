import { Component } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {PageComponent} from '../../../shared/components/page/page/page.component';
import {PageContentComponent} from '../../../shared/components/page/page-content/page-content.component';
import {PageSectionComponent} from '../../../shared/components/page/page-section/page-section.component';
import {PageSectionContentComponent} from '../../../shared/components/page/page-section-content/page-section-content.component';
import {PageSectionListComponent} from '../../../shared/components/page/page-section-list/page-section-list.component';
import {PageSectionTitleComponent} from '../../../shared/components/page/page-section-title/page-section-title.component';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';

@Component({
  selector: 'app-user-study-execution-cancel-view',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    PageComponent,
    PageContentComponent,
    PageSectionComponent,
    PageSectionContentComponent,
    PageSectionListComponent,
    PageSectionTitleComponent,
    PageTitleComponent
  ],
  templateUrl: './user-study-execution-cancel-view.component.html',
  styleUrl: './user-study-execution-cancel-view.component.scss'
})
export class UserStudyExecutionCancelViewComponent {

}
