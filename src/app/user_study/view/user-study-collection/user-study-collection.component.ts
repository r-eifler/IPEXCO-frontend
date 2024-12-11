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
import {loadUserStudies} from '../../state/user-study.actions';
import {selectUserStudies, selectUserStudyParticipants} from '../../state/user-study.selector';
import {ActionCardComponent} from '../../../shared/components/action-card/action-card/action-card.component';
import {MatMenu, MatMenuItem} from '@angular/material/menu';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {PageComponent} from '../../../shared/components/page/page/page.component';
import {PageContentComponent} from '../../../shared/components/page/page-content/page-content.component';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {BreadcrumbComponent} from '../../../shared/components/breadcrumb/breadcrumb/breadcrumb.component';
import {BreadcrumbItemComponent} from '../../../shared/components/breadcrumb/breadcrumb-item/breadcrumb-item.component';
import {DemoCardComponent} from '../../../project/components/demo-card/demo-card.component';
import {UserStudyCardComponent} from '../../components/user-study-card/user-study-card.component';

@Component({
  selector: 'app-user-study-collection',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    ActionCardComponent,
    AsyncPipe,
    PageComponent,
    PageContentComponent,
    PageTitleComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    UserStudyCardComponent,
  ],
  templateUrl: './user-study-collection.component.html',
  styleUrls: ['./user-study-collection.component.scss'],
})
export class UserStudyCollectionComponent {


  store = inject(Store);
  router = inject(Router);
  route = inject(ActivatedRoute);

  userStudies$ = this.store.select(selectUserStudies);
  participants$ = this.store.select(selectUserStudyParticipants);

  constructor() {
    this.store.dispatch(loadUserStudies());
  }

  createNewUserStudy(): void {
    this.router.navigate(['..', 'new'], {relativeTo: this.route});
  }
}
