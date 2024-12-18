import {Component, inject, input, OnInit, output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserStudyStep} from '../../domain/user-study';
import {MatOption, MatSelect} from '@angular/material/select';
import {Demo} from '../../../project/domain/demo';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';

@Component({
    selector: 'app-demo-card',
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
    templateUrl: './demo-card.component.html',
    styleUrl: './demo-card.component.scss'
})
export class DemoCardComponent implements OnInit {

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string>(undefined, [Validators.required]),
    time: this.fb.control<number>(null),
    demo: this.fb.control<string>(undefined, Validators.required),
  })

  step = input.required<UserStudyStep>();
  demos = input.required<Demo[]>();
  first = input<boolean>(false);
  last = input<boolean>(false);

  demo$ = this.form.controls.demo.valueChanges;

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
        content: data.demo
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
