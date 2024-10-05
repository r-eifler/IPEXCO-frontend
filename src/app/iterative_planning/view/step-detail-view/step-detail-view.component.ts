import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { BreadcrumbModule } from 'src/app/shared/component/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/component/page/page.module';
import { IterationStepHeroComponent } from '../../components/iteration-step-hero/iteration-step-hero.component';
import { selectIterativePlanningProperties, selectIterativePlanningSelectedStep } from '../../state/iterative-planning.selector';

@Component({
  selector: 'app-step-detail-view',
  standalone: true,
  imports: [PageModule, AsyncPipe, IterationStepHeroComponent, BreadcrumbModule, MatIconModule, RouterLink],
  templateUrl: './step-detail-view.component.html',
  styleUrl: './step-detail-view.component.scss'
})
export class StepDetailViewComponent {
  private store = inject(Store);

  step$ = this.store.select(selectIterativePlanningSelectedStep);
  planProperties$ = this.store.select(selectIterativePlanningProperties);
}
