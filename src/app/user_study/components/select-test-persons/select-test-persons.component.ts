import { Component, computed, effect, inject, output, ViewChild } from "@angular/core";
import { filter, map, take } from "rxjs/operators";
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { selectUserStudyParticipantsOfStudy } from '../../state/user-study.selector';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserStudyExecution } from "../../domain/user-study-execution";
import { SelectionModel } from "@angular/cdk/collections";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { acceptUserStudyParticipant } from "../../state/user-study.actions";
import { ActionType, PlanForIterationStepUserAction } from "src/app/user_study_execution/domain/user-action";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";

interface TableData extends UserStudyExecution {
  date: Date,
  processingTime: Date | null,
  utility: number,
}

@Component({
    selector: "app-select-test-persons",
    imports: [
        FormsModule,
        CurrencyPipe,
        DatePipe,
        MatIconModule,
        MatTableModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
    ],
    templateUrl: "./select-test-persons.component.html",
    styleUrls: ["./select-test-persons.component.scss"]
})
export class SelectTestPersonsComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  selectedParticipants = output<string[]>()
  
  store = inject(Store);
  participants = toSignal(this.store.select(selectUserStudyParticipantsOfStudy));

  participantsTableData = computed(() =>{
      return this.participants()?.map(p => ({
        ...p,
        date: p.createdAt,
        processingTime: p.finished ? new Date(p.finishedAt.getTime() - p.createdAt.getTime()) : null,
        utility: p.timeLog.filter(a => a.type == ActionType.PLAN_FOR_ITERATION_STEP).
          map( a => a as PlanForIterationStepUserAction).
          map( a => a.data.utility ?  a.data.utility : 0).reduce((p,c) => Math.max(p,c), 0)
      })
      )
      }
    );

  displayedParticipants: TableData[] = [];

  displayedColumns: string[] = ['select', 'user', 'date', 'processingTime', 'utility', 'finished', 'payment', 'accepted'];

  selection = new SelectionModel<TableData>(true, []);

  constructor() {
    effect(() => {
      if(this.paginator === undefined){
        return;
      }
      const index = this.paginator?.pageIndex;
      const size = this.paginator?.pageSize;
      const tableData = this.participantsTableData();
      this.displayedParticipants =  tableData ? [...tableData].splice(index * size, size) : [];
    })
  }


  onPage(event: PageEvent){
    if(this.paginator === undefined){
      return;
    }
    const index = event.pageIndex;
    const size = event.pageSize;
    const tableData = this.participantsTableData();
    this.displayedParticipants =  tableData ? [...tableData].splice(index * size, size) : [];
  }

  isAllSelected(){
    const numSelected = this.selection.selected.length;
    const numRows = this.participants()?.length
    return numSelected == numRows;
  }
  
  toggleAllRows() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.participantsTableData()?.forEach(row => this.selection.select(row));
    this.selectedParticipants.emit(this.selection.selected.map(td => td.user));
  }

  toggle(row: TableData){
    this.selection.toggle(row);
    this.selectedParticipants.emit(this.selection.selected.map(td => td.user));
  }

  onAccept(dataPoint: TableData){
    this.store.dispatch(acceptUserStudyParticipant({userId: dataPoint.user}));
  }
}
