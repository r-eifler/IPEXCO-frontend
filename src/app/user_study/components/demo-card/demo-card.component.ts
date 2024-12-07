import {Component, inject, input, output} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserStudyStep} from '../../domain/user-study';
import {MatOption, MatSelect} from '@angular/material/select';
import {Demo} from '../../../demo/domain/demo';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-demo-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatLabel,
    ReactiveFormsModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './demo-card.component.html',
  styleUrl: './demo-card.component.scss'
})
export class DemoCardComponent {

  fb = inject(FormBuilder);

  form = this.fb.group({
    demo: ['', Validators.required],
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
    this.demo$.pipe(takeUntilDestroyed()).subscribe(
      newContent => this.changes.emit({
        type: this.step().type,
        content: newContent
      })
    );
  }

  ngOnInit(): void {
    this.form.controls.demo.setValue(this.step().content)
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
