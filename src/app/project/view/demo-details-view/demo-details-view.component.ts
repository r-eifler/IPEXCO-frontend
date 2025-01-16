import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { selectPlanPropertiesOfDemo, selectProjectDemo } from '../../state/project.selector';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DemoHeroComponent } from '../../components/demo-hero/demo-hero.component';
import { PlanPropertyBadgeComponent } from 'src/app/shared/components/plan-property-badge/plan-property-badge.component';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { SettingsComponent } from "../../components/settings/settings.component";
import { GeneralSettings } from '../../domain/general-settings';
import { deleteProjectDemo, updateDemo, updatePlanProperty } from '../../state/project.actions';
import { AskDeleteComponent } from 'src/app/shared/components/ask-delete/ask-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { PlanPropertyUpdatePanelComponent } from 'src/app/shared/components/plan-property-update-panel/plan-property-update-panel.component';

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
    ],
    templateUrl: './demo-details-view.component.html',
    styleUrl: './demo-details-view.component.scss'
})
export class DemoDetailsViewComponent {

  store = inject(Store);
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  demo$ = this.store.select(selectProjectDemo)
  planProperties$: Observable<Record<string, PlanProperty>> = this.store.select(selectPlanPropertiesOfDemo)
  planPropertiesList$: Observable<PlanProperty[]> = this.store.select(selectPlanPropertiesOfDemo).pipe(
    map((planProperties) => Object.values(planProperties ?? {}))
  );

  MUGS$: Observable<string[][]> = this.demo$.pipe(map((demo) => demo?.globalExplanation?.MUGS));
  MGCS$: Observable<string[][]> = this.demo$.pipe(map((demo) => demo?.globalExplanation?.MGCS));

  downloadData$ = combineLatest([this.demo$,this.planProperties$]).pipe(
    filter(([d,pp]) => !!d && !!pp),
    map(([d,pp]) => window.URL.createObjectURL(new Blob([JSON.stringify({
      demo: d,
      planProperties: pp
    })], { type: "text/json" }))))

  constructor(){
    this.MUGS$.subscribe(MUGS => console.log(MUGS));
  }


  onDelete(id: string){
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Demo", text: "Are you sure you want to delete the demo?"},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.store.dispatch(deleteProjectDemo({id}))
        this.router.navigate(["../.."], {relativeTo: this.route});
      }
    });
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
