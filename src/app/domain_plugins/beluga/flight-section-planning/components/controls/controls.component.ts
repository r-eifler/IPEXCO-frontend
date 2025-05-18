import { Component, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { selectBranches, selectBranchIndex } from '../../state/flight-section-planning.selector';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectDifferentBranch } from '../../state/flight-section-planning.actions';
import { Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-controls',
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatFormFieldModule, 
    MatSelectModule, 
    FormsModule, 
    ReactiveFormsModule,
    RouterLink,
    MatTooltipModule,
  ],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss'
})
export class ControlsComponent {

  disabled = input<boolean>(false);

  store = inject(Store);
  fb = inject(FormBuilder);

  form  = this.fb.group({
    branch: this.fb.control<number | undefined>(0)
  })
  
  selectedBranch = this.store.selectSignal(selectBranchIndex);
  branches = this.store.selectSignal(selectBranches);

  constructor(){
    effect(() => {
      this.form.controls.branch.setValue(this.selectedBranch())
    })

    this.form.controls.branch.valueChanges.pipe(takeUntilDestroyed()).subscribe(
      newIndex => {
        if(newIndex !== undefined && newIndex !== null){
          this.store.dispatch(selectDifferentBranch({index: newIndex}))
        }
      }
    );
  }



}
