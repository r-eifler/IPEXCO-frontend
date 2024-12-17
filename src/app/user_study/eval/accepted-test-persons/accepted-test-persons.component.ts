import { Component, inject } from "@angular/core";
import { filter, map } from "rxjs/operators";
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserStudyExecution } from "../../domain/user-study-execution";
import { acceptUserStudyParticipant } from "../../state/user-study.actions";
import { MatButtonModule } from "@angular/material/button";

interface TableData extends UserStudyExecution {
  date: Date,
  processingTime: Date
}

@Component({
  selector: "app-accepted-test-persons",
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: "./accepted-test-persons.component.html",
  styleUrls: ["./accepted-test-persons.component.scss"],
})
export class AcceptedTestPersonsComponent {
  
  store = inject(Store);
  participants$ = this.store.select(selectUserStudyParticipantsOfStudy);

  participantsTableData$ = this.participants$.pipe(
    filter(ps => !!ps),
    map(ps =>
      ps.map(p => ({
        ...p,
        date: p.createdAt,
        processingTime: p.finished ? new Date(p.finishedAt.getTime() - p.createdAt.getTime()) : null
      })
      )
    ));

  displayedColumns: string[] = ['user', 'date', 'processingTime', 'finished', 'payment', 'accepted'];

  
  onAccept(dataPoint: TableData){
    this.store.dispatch(acceptUserStudyParticipant({userId: dataPoint.user}));
  }
}
