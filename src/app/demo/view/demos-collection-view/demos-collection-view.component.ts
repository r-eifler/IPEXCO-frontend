import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { DomainSpecification } from 'src/app/global_specification/domain/domain_specification';
import { RunStatus } from 'src/app/iterative_planning/domain/run';
import { ActionCardComponent } from 'src/app/shared/components/action-card/action-card/action-card.component';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { DemoCardComponent } from '../../components/demo-card/demo-card.component';
import { loadDemos, uploadDemo } from '../../state/demo.actions';
import { demosFeature } from '../../state/demo.feature';
import { selectAllFinishedDemos } from '../../state/demo.selector';
import { Demo } from 'src/app/shared/domain/demo';

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
  demoProperties$ = this.store.select(demosFeature.selectDemoProperties);

  router = inject(Router);

  demoFile$ = new BehaviorSubject<any>(null);

  onRunIterPlanning(id: string){
    this.router.navigate(['/iterative-planning', id]);
  }

  constructor(){
    this.store.dispatch(loadDemos());
  }

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0){
      let file =input.files[0];
      if (typeof FileReader !== "undefined") {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          let result  = e.target.result;
          let {demo, planProperties, domainSpecification}: {
            demo: Demo, 
            planProperties: Record<string, PlanProperty>,
            domainSpecification: DomainSpecification
          } = JSON.parse(result);
          this.store.dispatch(uploadDemo({demo, planProperties: Object.values(planProperties), domainSpecification}));
        };
      

        reader.readAsText(file);
      }
    }
  }
}
