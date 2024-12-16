import { Component, computed, inject, output } from "@angular/core";
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

interface TableData extends UserStudyExecution {
  date: Date,
  processingTime: Date
}

@Component({
  selector: "app-select-test-persons",
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: "./select-test-persons.component.html",
  styleUrls: ["./select-test-persons.component.scss"],
})
export class SelectTestPersonsComponent {

  selectedParticipants = output<string[]>()
  
  store = inject(Store);
  participants = toSignal(this.store.select(selectUserStudyParticipantsOfStudy));

  participantsTableData = computed(() =>{
      console.log(this.participants());
      return this.participants()?.map(p => ({
        ...p,
        date: p.createdAt,
        processingTime: new Date(p.finishedAt.getTime() - p.createdAt.getTime())
      })
      )
      }
    );


  displayedColumns: string[] = ['select', 'user', 'date', 'processingTime', 'finished', 'payment', 'accepted'];

  selection = new SelectionModel<TableData>(true, []);

  isAllSelected(){
    const numSelected = this.selection.selected.length;
    const numRows = this.participants().length
    return numSelected == numRows;
  }
  
  toggleAllRows() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.participantsTableData().forEach(row => this.selection.select(row));
    this.selectedParticipants.emit(this.selection.selected.map(td => td.user));
  }

  toggle(row){
    this.selection.toggle(row);
    this.selectedParticipants.emit(this.selection.selected.map(td => td.user));
  }

  onAccept(dataPoint: TableData){
    this.store.dispatch(acceptUserStudyParticipant({userId: dataPoint.user}));
  }
}
