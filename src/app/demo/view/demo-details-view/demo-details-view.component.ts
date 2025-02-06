import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { DemoHeroComponent } from 'src/app/project/components/demo-hero/demo-hero.component';
import { SettingsComponent } from 'src/app/project/components/settings/settings.component';
import { GeneralSettings } from 'src/app/project/domain/general-settings';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { DemoInfoComponent } from 'src/app/shared/components/demo/demo-info/demo-info.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { PlanPropertyBadgeComponent } from 'src/app/shared/components/plan-property-badge/plan-property-badge.component';
import { PlanPropertyUpdatePanelComponent } from 'src/app/shared/components/plan-property-update-panel/plan-property-update-panel.component';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { loadOutputSchemas, loadPrompts, loadServices, updateDemo, updatePlanProperty } from '../../state/demo.actions';
import { selectDemo, selectExplainer, selectOutputSchemas, selectPlanners, selectPlanPropertiesListOfDemo, selectPlanPropertiesOfDemo, selectPrompts } from '../../state/demo.selector';

@Component({
    selector: 'app-demo-details-view',
    imports: [
        PageModule,
        BreadcrumbModule,
        MatIconModule,
        RouterLink,
        AsyncPipe,
        MatButtonModule,
        DemoHeroComponent,
        PlanPropertyUpdatePanelComponent,
        PlanPropertyBadgeComponent,
        SettingsComponent,
        AsyncPipe,
        DemoInfoComponent
    ],
    templateUrl: './demo-details-view.component.html',
    styleUrl: './demo-details-view.component.scss'
})
export class DemoDetailsViewComponent {

  store = inject(Store);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  demo$ = this.store.select(selectDemo)
  planProperties$ = this.store.select(selectPlanPropertiesOfDemo)
  planPropertiesList$ = this.store.select(selectPlanPropertiesListOfDemo)
  planners$ = this.store.select(selectPlanners);
  explainer$ = this.store.select(selectExplainer);
  prompts$ = this.store.select(selectPrompts);
  outputSchemas$ = this.store.select(selectOutputSchemas);

  MUGS$: Observable<string[][]> = this.demo$.pipe(map((demo) => demo?.globalExplanation?.MUGS));
  MGCS$: Observable<string[][]> = this.demo$.pipe(map((demo) => demo?.globalExplanation?.MGCS));

  downloadData$ = combineLatest([this.demo$,this.planProperties$]).pipe(
    filter(([d,pp]) => !!d && !!pp),
    map(([d,pp]) => window.URL.createObjectURL(new Blob([JSON.stringify({
      demo: d,
      planProperties: pp
    })], { type: "text/json" }))))


  constructor() {
    this.store.dispatch(loadServices());
    this.store.dispatch(loadPrompts());
    this.store.dispatch(loadOutputSchemas());
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

    updateProperty(property: PlanProperty){
      this.store.dispatch(updatePlanProperty({planProperty: property}));
    }

}
