import { AsyncPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, startWith } from 'rxjs';
import { UserStudyStep } from '../../domain/user-study';

@Component({
  selector: 'app-tool-description-card',
  imports: [
    MatCardModule,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatSliderModule
  ],
  templateUrl: './user-manual-card.component.html',
  styleUrl: './user-manual-card.component.scss'
})
export class UserManualCardComponent {

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string>(undefined, [Validators.required]),
    time: this.fb.control<number>(null),
  })

  step = input.required<UserStudyStep>();
  first = input<boolean>(false);
  last = input<boolean>(false);

  description$: Observable<string>;

  changes = output<UserStudyStep>();
  up = output<void>();
  down = output<void>();
  delete = output<void>();

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(
      data => this.changes.emit({
        type: this.step().type,
        name: data.name,
        time: data.time,
        content: ""
      })
    );
  }

  formatLabel(value: number): string {
    if (value >= 60) {
      return Math.round(value / 60) + 'm';
    }

    return value + 's';
  }

  ngOnInit(): void {
    this.form.controls.name.setValue(this.step().name);
    this.form.controls.time.setValue(this.step().time);
  }

  moveUp() {
    this.up.emit();
  }

  moveDown() {
    this.down.emit();
  }

  deletePart() {
    this.delete.emit();
  }

}
