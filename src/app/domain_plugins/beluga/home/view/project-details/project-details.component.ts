import { AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
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
import { MultiFlightCardComponent } from '../../../shared/components/multi-flight-card/multi-flight-card.component';
import { BelugaProblem } from '../../../shared/domain/beluga_problem';
import { MultiProductionLineCardComponent } from '../../../shared/components/multi-production-line-card/multi-production-line-card.component';

@Component({
  selector: 'app-project-details',
  imports: [
    PageModule,
    MatIconModule,
    ProjectActionCardComponent,
    RouterLink,
    MatButtonModule,
    TranslocoModule,
    BreadcrumbModule,
    MultiFlightCardComponent,
    MultiProductionLineCardComponent,
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
  
  project = this.store.selectSignal(selectProject);

  instance = computed(() => this.project()?.baseTask.model as BelugaProblem)

  deleteProject(): void {
    let project = this.project();
    if(project !== null && project !== undefined){
      this.store.dispatch(deleteProject({id: project._id}));
      this.router.navigate(['/projects']);    
    }
  }

}
