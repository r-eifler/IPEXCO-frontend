import { Component, ElementRef, inject, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserStudy, selectUserStudyDemos, selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { RouterLink } from '@angular/router';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { OverviewDataComponent } from '../../components/overview-data/overview-data.component';
import { UserStudyDashboardComponent } from "../../components/user-study-dashboard/user-study-dashboard.component";
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, filter, map } from 'rxjs';
import { UserStudyStepType } from '../../domain/user-study';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { loadUserStudyDemos } from '../../state/user-study.actions';
import { SelectTestPersonsComponent } from '../../components/select-test-persons/select-test-persons.component';


@Component({
    selector: 'app-user-study-evaluation-view',
    imports: [
        PageModule,
        RouterLink,
        BreadcrumbModule,
        MatIconModule,
        AsyncPipe,
        OverviewDataComponent,
        UserStudyDashboardComponent,
        MatButtonModule,
        AsyncPipe,
        MatFormFieldModule,
        MatSelectModule,
        AsyncPipe,
        SelectTestPersonsComponent
    ],
    templateUrl: './user-study-evaluation-view.component.html',
    styleUrl: './user-study-evaluation-view.component.scss'
})
export class UserStudyEvaluationViewComponent {
  
  store = inject(Store)

  userStudy$ = this.store.select(selectUserStudy);
  participants$ = this.store.select(selectUserStudyParticipantsOfStudy);

  demoIds$ = this.userStudy$.pipe(
    map(us => us?.steps?.filter(s => s.type == UserStudyStepType.demo).map(s => s.content))
  );
  demos$ = combineLatest([this.store.select(selectUserStudyDemos), this.demoIds$]).pipe(
    map(([demos, demoIds]) => 
      demoIds ? 
      demos?.filter(d => d._id != undefined ? demoIds.includes(d._id) : false) :
      []
    )
  )

  selectedParticipants: WritableSignal<string[]> = signal([]);
  selectedDemo: WritableSignal<string|null> = signal(null);

  downloadData$ = this.participants$.pipe(map(participants => window.URL.createObjectURL(new Blob([JSON.stringify(participants)], { type: "text/json" }))))

  constructor() {
    this.store.dispatch(loadUserStudyDemos());
  }

  onSelectDemo(change: MatSelectChange){
    console.log("eval demo: " + change.value);
    this.selectedDemo.set(change.value);
  }

  updateSelectedParticipants(selected: string[]){
    this.selectedParticipants.set(selected);
  }


}
