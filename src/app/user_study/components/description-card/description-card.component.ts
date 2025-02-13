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
import {MatSliderModule} from '@angular/material/slider';
import { Observable, startWith } from 'rxjs';

@Component({
    selector: 'app-description-card',
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
        MatSliderModule
    ],
    templateUrl: './description-card.component.html',
    styleUrl: './description-card.component.scss'
})
export class DescriptionCardComponent implements OnInit{

  fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string | null>(null, [Validators.required]),
    time: this.fb.control<number>(1),
    description: this.fb.control<string | null>(null, [Validators.required, Validators.minLength(1)])
  })

  step = input.required<UserStudyStep>();
  first = input<boolean>(false);
  last = input<boolean>(false);

  description$: Observable<string | null>;

  changes = output<UserStudyStep>();
  up = output<void>();
  down = output<void>();
  delete = output<void>();

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(
      data => this.changes.emit({
        type: this.step().type,
        name: data.name ?? '',
        time: data.time ? data.time <= 60 ? data.time : (Math.floor(data.time / 60)*60) : null,
        content: data.description ?? undefined
      })
    );

    this.description$ = this.form.controls.description.valueChanges.pipe(
      startWith(this.step()?.content ?? null)
    );
  }

  formatLabel(value: number): string {
    if (value >= 60) {
      return Math.floor(value / 60) + 'm';
    }

    return value + 's';
  }

  ngOnInit(): void {
    this.form.controls.name.setValue(this.step().name, {emitEvent: false});
    this.form.controls.time.setValue(this.step().time, {emitEvent: false});
    const content = this.step().content;
    if(content !== undefined)
      this.form.controls.description.setValue(content, {emitEvent: false});
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
