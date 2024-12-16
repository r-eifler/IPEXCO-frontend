import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserStudy, selectUserStudyDemos } from '../../state/user-study.selector';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { RouterLink } from '@angular/router';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { SelectTestPersonsComponent } from '../../eval/select-test-persons/select-test-persons.component';
import { OverviewDataComponent } from '../../eval/overview-data/overview-data.component';

@Component({
  selector: 'app-user-study-evaluation-view',
  standalone: true,
  imports: [
    PageModule,
    RouterLink,
    BreadcrumbModule,
    MatIconModule,
    AsyncPipe,
    SelectTestPersonsComponent,
    OverviewDataComponent
  ],
  templateUrl: './user-study-evaluation-view.component.html',
  styleUrl: './user-study-evaluation-view.component.scss'
})
export class UserStudyEvaluationViewComponent {

  store = inject(Store)

  userStudy$ = this.store.select(selectUserStudy);
  demos$ = this.store.select(selectUserStudyDemos);

  selectedParticipants: WritableSignal<string[]> = signal([])

  updateSelectedParticipants(selected: string[]){
    console.log(selected);
    this.selectedParticipants.set(selected);
  }



}
