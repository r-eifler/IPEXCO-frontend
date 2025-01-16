import { Component, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { Demo } from 'src/app/project/domain/demo';
import { UserStudyStep } from '../../domain/user-study';

@Component({
  selector: 'app-demo-info-card',
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
  templateUrl: './demo-info-card.component.html',
  styleUrl: './demo-info-card.component.scss'
})
export class DemoInfoCardComponent {

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string>(undefined, [Validators.required]),
    time: this.fb.control<number>(1),
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
