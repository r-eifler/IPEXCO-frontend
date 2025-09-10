
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { Flight } from '../../../shared/domain/beluga_problem';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


interface DisplayFlight {
    originalIndex: number,
    name: string
}

@Component({
  selector: 'app-new-flight-horizon-dialog',
  imports: [
    DialogModule,
    MatButtonModule,
    CdkDropList, 
    CdkDrag,
    MatListModule,
  ],
  templateUrl: './new-flight-horizon-dialog.component.html',
  styleUrl: './new-flight-horizon-dialog.component.scss'
})
export class NewFlightHorizonDialogComponent {

  readonly dialogRef = inject(MatDialogRef<NewFlightHorizonDialogComponent>);

  data = inject<{
    neededFlights: (Flight & {originalIndex: number})[]
  }>(MAT_DIALOG_DATA);

  configValid = false;

  displayHorizonFlights: DisplayFlight[] = []

  displayNotConsideredFlights: DisplayFlight[] = []

  onStart(){
    const horizon = this.displayHorizonFlights.map(f => f.originalIndex)

    this.dialogRef.close({
      horizon
    })
  }

  onCancel(){
    this.dialogRef.close()
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
    this.displayNotConsideredFlights = this.data.neededFlights.map(flight => ({
      originalIndex: flight.originalIndex,
      name: flight.name,
    }))
  }

  onSelectAllFlights(){
    this.displayHorizonFlights = [...this.displayNotConsideredFlights, ...this.displayHorizonFlights];
    this.displayNotConsideredFlights = []
    this.displayHorizonFlights.sort((a, b) => a.originalIndex - b.originalIndex);
    this.configValid = this.displayHorizonFlights.length > 0
  }
}
