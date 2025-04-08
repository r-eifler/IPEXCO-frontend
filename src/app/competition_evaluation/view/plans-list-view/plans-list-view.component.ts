import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActionCardModule } from 'src/app/shared/components/action-card/action-card.module';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { PlanCardComponent } from '../../components/plan-card/plan-card.component';
import { loadEvaluationInstances, uploadEvaluationInstance } from '../../state/competition_evaluation.actions';
import { selectEvaluationInstances } from '../../state/competition_evaluation.feature';
import { EvalInstanceUploadComponent } from '../eval-instance-upload/eval-instance-upload.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-plans-list-view',
  imports: [
    PageModule,
    AsyncPipe,
    ActionCardModule,
    MatIconModule,
    RouterLink,
    BreadcrumbModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    PlanCardComponent
  ],
  templateUrl: './plans-list-view.component.html',
  styleUrl: './plans-list-view.component.scss'
})
export class PlansListViewComponent {

  store = inject(Store);
  dialog = inject(MatDialog);

  evaluationInstances$ = this.store.select(selectEvaluationInstances);
  constructor() {
    this.store.dispatch(loadEvaluationInstances());
  }

  onUpload(){
    let dialogRef = this.dialog.open(EvalInstanceUploadComponent);
    dialogRef.afterClosed().pipe(take(1)).subscribe(instance =>{
      if(instance){
        this.store.dispatch(uploadEvaluationInstance({evalInstance: instance}))
      }
    });
  }
}
