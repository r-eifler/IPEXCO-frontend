import { AsyncPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSlider, MatSliderModule, MatSliderThumb } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, startWith } from 'rxjs';
import { UserStudyStep } from '../../domain/user-study';
import { Demo } from 'src/app/project/domain/demo';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-tool-description-card',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatLabel,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatInput,
    MatSlider,
    MatSliderThumb
  ],
  templateUrl: './user-manual-card.component.html',
  styleUrl: './user-manual-card.component.scss'
})
export class UserManualCardComponent {

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string>(undefined, [Validators.required]),
    demo: this.fb.control<string>(undefined, Validators.required),
    time: this.fb.control<number>(1),
  })

  step = input.required<UserStudyStep>();
  demos = input.required<Demo[]>();
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
        time: data.time <= 60 ? data.time : (Math.floor(data.time / 60)*60) ,
        content: data.demo
      })
    );
  }

  formatLabel(value: number): string {
    if (value >= 60) {
      return Math.floor(value / 60) + 'm';
    }

    return value + 's';
  }

  ngOnInit(): void {
    this.form.controls.name.setValue(this.step().name);
    this.form.controls.time.setValue(this.step().time);
    this.form.controls.demo.setValue(this.step().content);
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
