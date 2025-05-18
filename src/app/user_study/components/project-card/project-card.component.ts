import { Component, inject, input, output } from '@angular/core';
import { UserStudyDemoStep, UserStudyProjectStep, UserStudyStep } from '../../domain/user-study';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { Project } from 'src/app/shared/domain/project';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-project-card',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatLabel,
    ReactiveFormsModule,
    MatSelect,
    MatOptionModule,
    MatInput,
    MatSlider,
    MatSliderThumb
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {

    fb = inject(FormBuilder);
  
    form = this.fb.group({
      name: this.fb.control<string | null>(null, [Validators.required]),
      time: this.fb.control<number>(1),
      project: this.fb.control<string | null>(null, Validators.required),
    })
  
    step = input.required<UserStudyProjectStep>();
    projects = input.required<Project[]>();
    first = input<boolean>(false);
    last = input<boolean>(false);
  
    project$ = this.form.controls.project.valueChanges;
  
    changes = output<UserStudyStep>();
    up = output<void>();
    down = output<void>();
    delete = output<void>();
  
    constructor() {
      this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(
        data => this.changes.emit({
          type: this.step().type,
          name: data.name ?? '',
          time:  data.time ? (data.time <= 60 ? data.time : (Math.floor(data.time / 60)*60)) : null,
          content: data.project ?? undefined
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
      const content = this.step().content
      if(content !== undefined)
        this.form.controls.project.setValue(content);
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
