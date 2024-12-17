import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconButton, MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { BreadcrumbItemComponent } from 'src/app/shared/components/breadcrumb/breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbComponent } from 'src/app/shared/components/breadcrumb/breadcrumb/breadcrumb.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { UserStudyHeroComponent } from '../../components/user-study-hero/user-study-hero.component';
import { AcceptedTestPersonsComponent } from '../../eval/accepted-test-persons/accepted-test-persons.component';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectUserStudies, selectUserStudy, selectUserStudyParticipantDistribution, selectUserStudyParticipants, selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { AskDeleteComponent } from 'src/app/shared/components/ask-delete/ask-delete.component';
import { deleteParticipantDistribution, loadUserStudies } from '../../state/user-study.actions';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-participant-distribution-details-view',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    MatIcon,
    MatIconButton,
    PageModule,
    MatListModule,
    RouterLink,
    MatButtonModule,
    AsyncPipe,
    MatTooltip,
    MatExpansionModule,
    MatTableModule,
    MatCheckboxModule,
    NgxChartsModule,
    MatMenuModule
  ],
  templateUrl: './participant-distribution-details-view.component.html',
  styleUrl: './participant-distribution-details-view.component.scss'
})
export class ParticipantDistributionDetailsViewComponent {

  store = inject(Store);
  router = inject(Router);
  dialog = inject(MatDialog);
  snackbar = inject(MatSnackBar);

  colorScheme = {
    domain: ['#00a47b', '#5b44d5']
  };

  distribution$ = this.store.select(selectUserStudyParticipantDistribution);
  usedStudyIds$ = this.distribution$.pipe(
    filter(d => !!d), 
    map(d => d.userStudies.map(us => us.userStudy))
  );
  userStudies$ = this.store.select(selectUserStudies);
  selectedUserStudies$ = combineLatest([this.usedStudyIds$, this.userStudies$]).pipe(
    filter(([ids, studies]) => !!ids && !!studies),
    map(([ids, studies]) => studies.filter(s => ids.includes(s._id)))
  );

  participants$ = this.store.select(selectUserStudyParticipants);

  participantsPerStudy$: Observable<Record<string, number>> = 
  combineLatest([this.selectedUserStudies$, this.participants$]).pipe(
    filter(([selectedUserStudies, participants]) => !!selectedUserStudies && !! participants),
    map(([selectedUserStudies, participants]) => 
      selectedUserStudies.reduce((p,c) => ({...p, [c._id]: participants[c._id]?.length}), {}))
  );

  neededParticipantsPerStudy$ : Observable<Record<string, number>> = this.distribution$.pipe(
    filter(d => !!d), 
    map(d => d.userStudies.reduce((p: Record<string, number>,c) => ({...p, [c.userStudy]: c.numberParticipants}), {}))
  );

  chartsValues$ = combineLatest([this.selectedUserStudies$, this.participantsPerStudy$, this.neededParticipantsPerStudy$]).pipe(
    filter(([selectedUserStudies, participants, needed]) => !!selectedUserStudies && !! participants && !!needed),
    map(([selectedUserStudies, participants, needed]) => selectedUserStudies.map( 
      (us) => ({
        name: us.name, 
        series: [
          {
            name: "finished",
            value: participants[us._id] ?? 0
          },
          {
            name: "pending",
            value: needed[us._id] - participants[us._id]
          },
        ]
      }) 
    ))
  )

  constructor(){
    this.store.dispatch(loadUserStudies());
    // this.chartsValues$.subscribe((v) => console.log(v));
  }

  onCopyLink(){
    const host = window.location.protocol + "//" + window.location.host;
    this.distribution$.pipe(take(1)).subscribe(dis => navigator.clipboard.writeText(host + '/user-study-execution/distribution/' + dis._id));
    let snackBarRef = this.snackbar.open('User study distribution link copied to clipboard.', 'close');
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: 'Delete Participant Distribution', text: 'Are you sure you want to delete the distribution?'},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.store.dispatch((deleteParticipantDistribution({id})));
        this.router.navigate(['user-study', 'collection']);
      }
    });
  }

}
