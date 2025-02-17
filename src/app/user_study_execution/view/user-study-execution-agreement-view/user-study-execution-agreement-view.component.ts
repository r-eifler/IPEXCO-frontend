import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {selectExecutionUserStudy} from '../../state/user-study-execution.selector';
import {AsyncPipe} from '@angular/common';
import {MatAnchor, MatButtonModule} from '@angular/material/button';
import {PageComponent} from '../../../shared/components/page/page/page.component';
import {PageContentComponent} from '../../../shared/components/page/page-content/page-content.component';
import {PageSectionComponent} from '../../../shared/components/page/page-section/page-section.component';
import {PageSectionContentComponent} from '../../../shared/components/page/page-section-content/page-section-content.component';
import {PageSectionListComponent} from '../../../shared/components/page/page-section-list/page-section-list.component';
import {PageSectionTitleComponent} from '../../../shared/components/page/page-section-title/page-section-title.component';
import {PageModule} from '../../../shared/components/page/page.module';
import {Router} from '@angular/router';
import {registerUserStudyUser} from '../../state/user-study-execution.actions';
import { InfoComponent } from 'src/app/shared/components/info/info/info.component';
import { MatIconModule } from '@angular/material/icon';
import { ChatMarkdownMessageComponent } from 'src/app/shared/components/chat/chat-markdown-message/chat-markdown-message.component';
import { Marked } from 'marked';
import { MarkedPipe } from 'src/app/pipes/marked.pipe';

@Component({
    selector: 'app-user-study-execution-agreement-view',
    imports: [
        AsyncPipe,
        MatButtonModule,
        PageModule,
        InfoComponent,
        MatIconModule,
        MarkedPipe
    ],
    templateUrl: './user-study-execution-agreement-view.component.html',
    styleUrl: './user-study-execution-agreement-view.component.scss'
})
export class UserStudyExecutionAgreementViewComponent {

  store = inject(Store);
  router = inject(Router);

  userStudy$ = this.store.select(selectExecutionUserStudy);

  onAccept(id: string) {
    this.store.dispatch(registerUserStudyUser({id}));
  }
}
