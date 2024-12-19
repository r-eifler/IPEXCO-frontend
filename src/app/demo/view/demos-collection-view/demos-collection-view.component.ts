import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { RunStatus } from 'src/app/iterative_planning/domain/run';
import { selectAllDemos, selectDemoProperties } from '../../state/demo.selector';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { loadDemos } from '../../state/demo.actions';
import { DemoCardComponent } from '../../components/demo-card/demo-card.component';

@Component({
  selector: 'app-demos-collection-view',
  imports: [
    PageModule,
    AsyncPipe,
    DemoCardComponent,
    MatIconModule,
    RouterLink,
    BreadcrumbModule
  ],
  templateUrl: './demos-collection-view.component.html',
  styleUrl: './demos-collection-view.component.scss'
})
export class DemosCollectionViewComponent {

  runStatus = RunStatus;

  store = inject(Store);

  demos$ = this.store.select(selectAllDemos);
  demoProperties$ = this.store.select(selectDemoProperties);

  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);

  onRunIterPlanning(id: string){
    this.router.navigate(['/iterative-planning', id]);
  }

  constructor(){
    this.store.dispatch(loadDemos());
  }

}
