import {Component, inject, input, OnInit, output, SecurityContext} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatFormField} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {AsyncPipe} from '@angular/common';
import {UserStudyStep} from '../../domain/user-study';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DomSanitizer} from '@angular/platform-browser';
import {map} from 'rxjs/operators';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';

@Component({
    selector: 'app-form-card',
    imports: [
        MatCardModule,
        MatFormField,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        AsyncPipe,
        MatSlider,
        MatSliderThumb,
    ],
    templateUrl: './form-card.component.html',
    styleUrl: './form-card.component.scss'
})
export class FormCardComponent implements OnInit {

  fb = inject(FormBuilder);
  domSanitizer = inject(DomSanitizer);

  form = this.fb.group({
    name: this.fb.control<string>(undefined, [Validators.required]),
    time: this.fb.control<number>(1),
    url: this.fb.control<string | undefined>('', [Validators.required,  Validators.minLength(1)]),
  })

  step = input.required<UserStudyStep>();
  first = input<boolean>(false);
  last = input<boolean>(false);

  url$ = this.form.controls.url.valueChanges.pipe(
    map(link => this.domSanitizer.sanitize(SecurityContext.URL, link))
  )

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
        content: data.url
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
    this.form.controls.url.setValue(this.step().content)
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
