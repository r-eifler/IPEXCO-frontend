import {Component, inject, input, OnInit, output} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserStudyStep} from '../../domain/user-study';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatTabsModule} from '@angular/material/tabs';
import {AsyncPipe} from '@angular/common';
import {MarkedPipe} from '../../../pipes/marked.pipe';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-description-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormField,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    AsyncPipe,
    MarkedPipe,
  ],
  templateUrl: './description-card.component.html',
  styleUrl: './description-card.component.scss'
})
export class DescriptionCardComponent implements OnInit{

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string>(null, [Validators.required]),
    description: this.fb.control<string>(null, [Validators.required, Validators.minLength(1)])
  })

  step = input.required<UserStudyStep>();
  first = input<boolean>(false);
  last = input<boolean>(false);

  description$ = this.form.controls.description.valueChanges;

  changes = output<UserStudyStep>();
  up = output<void>();
  down = output<void>();
  delete = output<void>();

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(
      data => this.changes.emit({
        type: this.step().type,
        name: data.name,
        content: data.description
      })
    );
  }

  ngOnInit(): void {
    this.form.controls.name.setValue(this.step().name);
    this.form.controls.description.setValue(this.step().content);
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
