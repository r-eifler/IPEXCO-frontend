import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserStudy } from "../../domain/user-study";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardContent, MatCardModule } from "@angular/material/card";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {Store} from '@ngrx/store';
import {loadParticipantDistributions, loadUserStudies} from '../../state/user-study.actions';
import {selectUserStudies, selectUserStudyParticipantDistributions, selectUserStudyParticipants} from '../../state/user-study.selector';
import {ActionCardComponent} from '../../../shared/components/action-card/action-card/action-card.component';
import {MatMenu, MatMenuItem} from '@angular/material/menu';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PageComponent} from '../../../shared/components/page/page/page.component';
import {PageContentComponent} from '../../../shared/components/page/page-content/page-content.component';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {BreadcrumbComponent} from '../../../shared/components/breadcrumb/breadcrumb/breadcrumb.component';
import {BreadcrumbItemComponent} from '../../../shared/components/breadcrumb/breadcrumb-item/breadcrumb-item.component';
import {UserStudyCardComponent} from '../../components/user-study-card/user-study-card.component';
import { PageSectionTitleComponent } from "../../../shared/components/page/page-section-title/page-section-title.component";
import { PageModule } from 'src/app/shared/components/page/page.module';
import { loadUserStudyParticipantDistributionResolver } from '../../resolver/load-user-study-participant-distribution.resolver';
import { ParticipantDistributionCardComponent } from '../../components/participant-distribution-card/participant-distribution-card.component';

@Component({
    selector: 'app-user-study-collection',
    imports: [
        MatIconModule,
        MatButtonModule,
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        ActionCardComponent,
        AsyncPipe,
        PageModule,
        PageContentComponent,
        PageTitleComponent,
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        UserStudyCardComponent,
        PageSectionTitleComponent,
        ParticipantDistributionCardComponent
    ],
    templateUrl: './user-study-collection.component.html',
    styleUrls: ['./user-study-collection.component.scss']
})
export class UserStudyCollectionComponent {


  store = inject(Store);
  router = inject(Router);
  route = inject(ActivatedRoute);

  userStudies$ = this.store.select(selectUserStudies);
  participants$ = this.store.select(selectUserStudyParticipants);
  participantsDistributions$ = this.store.select(selectUserStudyParticipantDistributions);

  constructor() {
    this.store.dispatch(loadUserStudies());
    this.store.dispatch(loadParticipantDistributions());
  }

  createNewUserStudy(): void {
    this.router.navigate(['..', 'new'], {relativeTo: this.route});
  }

  createNewUserStudyParticipantDistribution() {
    this.router.navigate(['..', 'new-distribution'], {relativeTo: this.route});
  }
}
