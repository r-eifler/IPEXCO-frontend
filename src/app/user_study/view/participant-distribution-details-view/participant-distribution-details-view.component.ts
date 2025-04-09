import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { AskDeleteComponent } from 'src/app/shared/components/ask-delete/ask-delete.component';
import { BreadcrumbItemComponent } from 'src/app/shared/components/breadcrumb/breadcrumb-item/breadcrumb-item.component';
import { BreadcrumbComponent } from 'src/app/shared/components/breadcrumb/breadcrumb/breadcrumb.component';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { deleteParticipantDistribution, loadUserStudies } from '../../state/user-study.actions';
import { selectUserStudies, selectUserStudyParticipantDistribution, selectUserStudyParticipants } from '../../state/user-study.selector';

@Component({
    selector: 'app-participant-distribution-details-view',
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
    filter(([ids, studies]) => 
      !!ids && 
      !!studies &&
      studies.every(s => s._id !== undefined)
    ),
    map(([ids, studies]) => studies !== undefined ? studies.filter(s => ids.includes(s._id as string)) : [])
  );

  participants$ = this.store.select(selectUserStudyParticipants);

  participantsPerStudy$: Observable<Record<string, number>> = 
  combineLatest([this.selectedUserStudies$, this.participants$]).pipe(
    filter(([selectedUserStudies, participants]) => 
      !!selectedUserStudies && 
      !!participants &&
      !!selectedUserStudies.every(s => s._id !== undefined) 
  ),
    map(([selectedUserStudies, participants]) => 
      selectedUserStudies.reduce((p,c) => ({...p, [(c._id as string)]: participants[c._id as string]?.length}), {}))
  );

  neededParticipantsPerStudy$ : Observable<Record<string, number>> = this.distribution$.pipe(
    filter(d => !!d), 
    map(d => d ? d.userStudies.reduce((p: Record<string, number>,c) => 
      ({...p, [c.userStudy]: c.numberParticipants}), 
      {}
    ) : {})
  );

  chartsValues$ = combineLatest([this.selectedUserStudies$, this.participantsPerStudy$, this.neededParticipantsPerStudy$]).pipe(
    filter(([selectedUserStudies, participants, needed]) => !!selectedUserStudies && !! participants && !!needed),
    map(([selectedUserStudies, participants, needed]) => selectedUserStudies.map( 
      (us) => ({
        name: us.name, 
        series: [
          {
            name: "finished",
            value: us._id ? participants[us._id] ?? 0 : 0
          },
          {
            name: "pending",
            value: us._id ?  needed[us._id] - participants[us._id] : 0
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
    this.distribution$.pipe(take(1)).subscribe(dis => {
      if(dis?._id !== undefined){
        navigator.clipboard.writeText(host + '/user-study-execution/distribution/' + dis._id)
        this.snackbar.open('User study distribution link copied to clipboard.', 'close');
      }
      else {
        this.snackbar.open('User study distribution link not available.', 'close');
      }
    });
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: 'Delete Participant Distribution', text: 'Are you sure you want to delete the distribution?'},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch((deleteParticipantDistribution({id})));
        this.router.navigate(['user-study', 'collection']);
      }
    });
  }

}
