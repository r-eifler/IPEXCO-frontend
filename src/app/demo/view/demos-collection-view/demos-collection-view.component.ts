import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { RunStatus } from 'src/app/iterative_planning/domain/run';
import { selectAllFinishedDemos, selectDemoProperties } from '../../state/demo.selector';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { loadDemos, uploadDemo } from '../../state/demo.actions';
import { DemoCardComponent } from '../../components/demo-card/demo-card.component';
import { ActionCardComponent } from 'src/app/shared/components/action-card/action-card/action-card.component';
import { BehaviorSubject } from 'rxjs';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { Demo } from 'src/app/project/domain/demo';

@Component({
  selector: 'app-demos-collection-view',
  imports: [
    PageModule,
    AsyncPipe,
    DemoCardComponent,
    MatIconModule,
    RouterLink,
    BreadcrumbModule,
    ActionCardComponent
  ],
  templateUrl: './demos-collection-view.component.html',
  styleUrl: './demos-collection-view.component.scss'
})
export class DemosCollectionViewComponent {

  runStatus = RunStatus;

  store = inject(Store);

  demos$ = this.store.select(selectAllFinishedDemos);
  demoProperties$ = this.store.select(selectDemoProperties);

  router = inject(Router);

  demoFile$ = new BehaviorSubject<any>(null);

  onRunIterPlanning(id: string){
    this.router.navigate(['/iterative-planning', id]);
  }

  constructor(){
    this.store.dispatch(loadDemos());
  }

  onUploadDemo(){

  }

  onFileChanged(event) {
    let file = event.target.files[0];
    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        let result  = e.target.result;
        console.log(result)
        let {demo, planProperties}: {demo: Demo, planProperties: Record<string, PlanProperty>} = JSON.parse(result);
        console.log(demo);
        console.log(planProperties);
        this.store.dispatch(uploadDemo({demo, planProperties: Object.values(planProperties)}));
      };
    

      reader.readAsText(file);
      console.log(file);
    }
  }
}
