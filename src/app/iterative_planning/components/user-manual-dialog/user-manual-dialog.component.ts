import { Component, inject } from '@angular/core';
import { DialogModule } from 'src/app/shared/components/dialog/dialog.module';
import { UserManualComponent } from '../user-manual/user-manual.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectIterativePlanningProject } from '../../state/iterative-planning.selector';
import { filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-manual-dialogue',
  imports: [
    DialogModule,
    UserManualComponent,
    MatButtonModule,
    MatIconModule,
    AsyncPipe
  ],
  templateUrl: './user-manual-dialog.component.html',
  styleUrl: './user-manual-dialog.component.scss'
})
export class UserManualDialogComponent {

  store = inject(Store);
  dialogRef = inject(MatDialogRef<UserManualComponent>);
  
  project$ = this.store.select(selectIterativePlanningProject);

  settings$ = this.project$.pipe(
    filter(p => !!p),
    map(p => p.settings)
  );

  onClose(){
    this.dialogRef.close();
  }

}
