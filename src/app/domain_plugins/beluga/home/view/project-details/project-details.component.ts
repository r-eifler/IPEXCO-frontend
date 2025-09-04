import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { ProjectActionCardComponent } from 'src/app/project/components/project-action-card/project-action-card.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { Router, RouterLink } from '@angular/router';
import { deleteProject } from '../../state/home.actions';
import { take } from 'rxjs';
import { filterNotNullOrUndefined } from 'src/app/shared/common/check_null_undefined';
import { MatButtonModule } from '@angular/material/button';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { selectProject } from '../../state/home.selector';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';

@Component({
  selector: 'app-project-details',
  imports: [
    PageModule,
    MatIconModule,
    AsyncPipe,
    ProjectActionCardComponent,
    RouterLink,
    MatButtonModule,
    TranslocoModule,
    BreadcrumbModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: "home",
      alias: "h",
    }),
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {

  store = inject(Store);
  router = inject(Router);
  
  project$ = this.store.select(selectProject);

  deleteProject(): void {
    this.project$.pipe(
      take(1),
      filterNotNullOrUndefined(),
    ).subscribe(p => this.store.dispatch(deleteProject({id: p._id})));
    this.router.navigate(['/projects']);
  }

}
