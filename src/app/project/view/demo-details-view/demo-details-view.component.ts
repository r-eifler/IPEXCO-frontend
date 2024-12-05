import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { selectPlanPropertiesOfDemo, selectProjectDemo } from '../../state/project.selector';
import { map, Observable, take } from 'rxjs';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DemoHeroComponent } from '../../components/demo-hero/demo-hero.component';
import { PlanPropertyPanelComponent } from 'src/app/shared/components/plan-property-panel/plan-property-panel.component';
import { PlanPropertyBadgeComponent } from 'src/app/shared/components/plan-property-badge/plan-property-badge.component';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { SettingsComponent } from "../../components/settings/settings.component";
import { GeneralSettings } from '../../domain/general-settings';
import { deleteProjectDemo, updateDemo } from '../../state/project.actions';

@Component({
  selector: 'app-demo-details-view',
  standalone: true,
  imports: [
    PageModule,
    BreadcrumbModule,
    MatIconModule,
    RouterLink,
    AsyncPipe,
    MatButtonModule,
    DemoHeroComponent,
    PlanPropertyPanelComponent,
    PlanPropertyBadgeComponent,
    SettingsComponent,
],
  templateUrl: './demo-details-view.component.html',
  styleUrl: './demo-details-view.component.scss'
})
export class DemoDetailsViewComponent {

  store = inject(Store);
  router = inject(Router);
  route = inject(ActivatedRoute);

  demo$ = this.store.select(selectProjectDemo)
  planProperties$: Observable<Record<string, PlanProperty>> = this.store.select(selectPlanPropertiesOfDemo)
  planPropertiesList$ = this.store.select(selectPlanPropertiesOfDemo).pipe(
    map((planProperties) => Object.values(planProperties ?? {}))
  );

  MUGS$ = this.demo$.pipe(map((demo) => demo?.globalExplanation?.MUGS));
  MGCS$ = this.demo$.pipe(map((demo) => demo?.globalExplanation?.MGCS));

  onDelete(){
    this.demo$.pipe(take(1)).subscribe(demo => {
      this.store.dispatch(deleteProjectDemo({id: demo._id}))
      this.router.navigate(["../.."], {relativeTo: this.route});
    })
  }

  onRunIterPlanning(){
    this.demo$.pipe(take(1)).subscribe(demo => {
      this.router.navigate(['/iterative-planning', demo._id]);
    })
  }

  updateSettings(settings: GeneralSettings){
    this.demo$.pipe(take(1)).subscribe(demo => {
      let newDemo = {...demo};
      newDemo.settings = settings;
      this.store.dispatch(updateDemo({demo: newDemo}))
    })
  }

}
