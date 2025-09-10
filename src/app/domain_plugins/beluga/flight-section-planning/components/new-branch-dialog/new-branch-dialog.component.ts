import { Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { uniqueValidation } from 'src/app/validators/unique.validator';
import { Flight } from '../../../shared/domain/beluga_problem';
import { FlightStatus, ProgressStatus } from '../../domain/utils';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatListModule, MatSelectionList, MatSelectionListChange } from '@angular/material/list';

interface DisplayFlight {
    originalIndex: number,
    name: string
}

@Component({
  selector: 'app-new-branch-dialog',
  imports: [
    DialogModule,
    MatButtonModule,
    TranslocoModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CdkDropList, 
    CdkDrag,
    MatListModule,
  ],
  templateUrl: './new-branch-dialog.component.html',
  styleUrl: './new-branch-dialog.component.scss'
})
export class NewBranchDialogComponent {

  readonly dialogRef = inject(MatDialogRef<NewBranchDialogComponent>);
  fb = inject(FormBuilder);

  data = inject<{
    existingBranchNames: string[],
    remainingFlights: Record<number,Flight>,
    flightIndices: number[],
    planSectionsStatuses: FlightStatus[]
  }>(MAT_DIALOG_DATA);

  control = this.fb.control('', [Validators.required, uniqueValidation(this.data.existingBranchNames)])

  displaySelectedPrefix: (DisplayFlight & {
    currentIndex: number
    selected: boolean;
    canBeChanged: boolean;
  })[] = [] 

  displayHorizonFlights: DisplayFlight[] = []

  displayNotConsideredFlights: DisplayFlight[] = []

  configValid = false;

  onStart(){

    const prefix = this.displaySelectedPrefix.filter(f => f.selected).map(f => f.originalIndex)
    const horizon = this.displayHorizonFlights.map(f => f.originalIndex)

    this.dialogRef.close({
      name: this.control.value,
      prefix,
      horizon
    })
  }

  onCancel(){
    this.dialogRef.close()
  }

  onChangePrefix(event: MatSelectionListChange){
    event.options.forEach( option => {
      if(option.selected){
        this.displayHorizonFlights = this.displayHorizonFlights.filter(flight => flight.originalIndex !== option.value.originalIndex);
        this.displayNotConsideredFlights = this.displayNotConsideredFlights.filter(flight => flight.originalIndex !== option.value.originalIndex);
      }
      else{
        this.displayNotConsideredFlights.push(option.value);
      }
      this.displaySelectedPrefix[option.value.currentIndex] = {
        ...this.displaySelectedPrefix[option.value.currentIndex],
        selected: option.selected
      }
    })
    this.configValid = this.displaySelectedPrefix.filter(f => !f.selected).length == 0


    const solvedPrefixFlightIndices = this.displaySelectedPrefix.filter(s => s.selected).map(s => s.originalIndex);
    const numSelected = solvedPrefixFlightIndices.length;

    this.displaySelectedPrefix = this.displaySelectedPrefix.map((flight, currentIndex) => ({
      ...flight,
      canBeChanged: currentIndex == numSelected - 1 || currentIndex == numSelected
    }));
  }

  drop(event: CdkDragDrop<DisplayFlight[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.configValid = this.displayHorizonFlights.length > 0
  }

  constructor(){

    
    const solvedPrefixFlightIndices = this.data.planSectionsStatuses.filter(s => s.status === ProgressStatus.DONE).map(s => s.originalIndex);
    const numSelected = solvedPrefixFlightIndices.length;

    this.displaySelectedPrefix = solvedPrefixFlightIndices.map((originalIndex, currentIndex) => ({
      currentIndex,
      originalIndex,
      name: this.data.remainingFlights[originalIndex].name,
      selected: solvedPrefixFlightIndices.includes(originalIndex),
      canBeChanged: currentIndex == numSelected - 1 || currentIndex == numSelected
    }));

    const doneFlightIndices = this.data.planSectionsStatuses.filter(s => s.status === ProgressStatus.DONE).map(s => s.originalIndex)

    this.displayHorizonFlights = this.data.flightIndices.
      map((index) => ({
        originalIndex: index,
        name: this.data.remainingFlights[index].name
      }));

    this.displayNotConsideredFlights = Object.keys(this.data.remainingFlights).
      map((index) => ({
        originalIndex: Number(index),
        name: this.data.remainingFlights[index].name
      })).
      filter((f) => ! doneFlightIndices.includes(f.originalIndex) && ! this.data.flightIndices.includes(f.originalIndex));

    this.configValid = this.displaySelectedPrefix.filter(f => !f.selected).length == 0

  }

}
