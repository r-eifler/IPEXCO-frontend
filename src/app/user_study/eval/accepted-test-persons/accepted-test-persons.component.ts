import { Component, computed, effect, inject, ViewChild } from "@angular/core";
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { UserStudyExecution } from "../../domain/user-study-execution";
import { acceptUserStudyParticipant } from "../../state/user-study.actions";
import { toSignal } from "@angular/core/rxjs-interop";
import { Sort } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

interface TableData extends UserStudyExecution {
  date: Date,
  processingTime: Date
}

@Component({
    selector: "app-accepted-test-persons",
    standalone: true,
    imports: [
      MatTableModule,
      MatPaginatorModule,
      CurrencyPipe,
      MatIconModule,
      DatePipe,
      MatButtonModule,
    ],
    templateUrl: "./accepted-test-persons.component.html",
    styleUrls: ["./accepted-test-persons.component.scss"]
})
export class AcceptedTestPersonsComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  store = inject(Store);
  participants = toSignal(this.store.select(selectUserStudyParticipantsOfStudy));

  participantsTableData = computed(() =>  
    this.participants()?.map(p => ({
      ...p,
      date: p.createdAt,
      processingTime: p.finished ? new Date(p.finishedAt.getTime() - p.createdAt.getTime()) : null
    })
    )
  );

  displayedParticipants: TableData[];

  displayedColumns: string[] = ['user', 'date', 'processingTime', 'finished', 'payment', 'accepted'];

  constructor() {
    effect(() => {
      const index = this.paginator?.pageIndex;
      const size = this.paginator?.pageSize;
      this.displayedParticipants =  this.participantsTableData() ? [...this.participantsTableData()].splice(index * size, size) : [];
    })
  }

  
  onAccept(dataPoint: TableData){
    this.store.dispatch(acceptUserStudyParticipant({userId: dataPoint.user}));
  }


  onPage(event: PageEvent){
    const index = event.pageIndex;
    const size = event.pageSize;
    this.displayedParticipants =  [...this.participantsTableData()].splice(index * size, size);
  }

  announceSortChange(sortState: Sort){
    console.log(sortState);
    const sorted = [...this.participantsTableData()].sort();
    const index = this.paginator.pageIndex;
    const size = this.paginator.pageSize;
    this.displayedParticipants =  sorted ? sorted.splice(index * size, size) : [];
  }
}
