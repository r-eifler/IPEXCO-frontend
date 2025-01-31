import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PlanPropertyPanelComponent } from 'src/app/shared/components/plan-property-panel/plan-property-panel.component';
import { PlanPropertyBadgeComponent } from 'src/app/shared/components/plan-property-badge/plan-property-badge.component';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { AskDeleteComponent } from 'src/app/shared/components/ask-delete/ask-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { DemoHeroComponent } from 'src/app/project/components/demo-hero/demo-hero.component';
import { SettingsComponent } from 'src/app/project/components/settings/settings.component';
import { selectDemo, selectPlanPropertiesListOfDemo, selectPlanPropertiesOfDemo } from '../../state/demo.selector';
import { GeneralSettings } from 'src/app/project/domain/general-settings';
import { updateDemo, updatePlanProperty } from '../../state/demo.actions';
import { DemoInfoComponent } from 'src/app/shared/components/demo/demo-info/demo-info.component';
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

  MUGS$: Observable<string[][]> = this.demo$.pipe(map((demo) => demo?.globalExplanation?.MUGS));
  MGCS$: Observable<string[][]> = this.demo$.pipe(map((demo) => demo?.globalExplanation?.MGCS));

  downloadData$ = combineLatest([this.demo$,this.planProperties$]).pipe(
    filter(([d,pp]) => !!d && !!pp),
    map(([d,pp]) => window.URL.createObjectURL(new Blob([JSON.stringify({
      demo: d,
      planProperties: pp
    })], { type: "text/json" }))))


  // onDelete(id: string){
  //   const dialogRef = this.dialog.open(AskDeleteComponent, {
  //     data: {name: "Delete Demo", text: "Are you sure you want to delete the demo?"},
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     if(result){
  //       // this.store.dispatch(deleteProjectDemo({id}))
  //       this.router.navigate(["../.."], {relativeTo: this.route});
  //     }
  //   });
  // }

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
