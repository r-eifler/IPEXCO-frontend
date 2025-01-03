import { Component, ElementRef, inject, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserStudy, selectUserStudyDemos, selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { RouterLink } from '@angular/router';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { SelectTestPersonsComponent } from '../../eval/select-test-persons/select-test-persons.component';
import { OverviewDataComponent } from '../../eval/overview-data/overview-data.component';
import { UserStudyDashboardComponent } from "../../components/user-study-dashboard/user-study-dashboard.component";
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs';


@Component({
    selector: 'app-user-study-evaluation-view',
    imports: [
        PageModule,
        RouterLink,
        BreadcrumbModule,
        MatIconModule,
        AsyncPipe,
        SelectTestPersonsComponent,
        OverviewDataComponent,
        UserStudyDashboardComponent,
        MatButtonModule,
        AsyncPipe
    ],
    templateUrl: './user-study-evaluation-view.component.html',
    styleUrl: './user-study-evaluation-view.component.scss'
})
export class UserStudyEvaluationViewComponent {
  
  store = inject(Store)

  userStudy$ = this.store.select(selectUserStudy);
  participants$ = this.store.select(selectUserStudyParticipantsOfStudy);

  selectedParticipants: WritableSignal<string[]> = signal([])

  downloadData$ = this.participants$.pipe(map(participants => window.URL.createObjectURL(new Blob([JSON.stringify(participants)], { type: "text/json" }))))

  updateSelectedParticipants(selected: string[]){
    this.selectedParticipants.set(selected);
  }


}
