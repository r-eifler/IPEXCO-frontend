import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { StepStatusColorPipe } from 'src/app/iterative_planning/domain/pipe/step-status-color.pipe';
import { StepStatusNamePipe } from 'src/app/iterative_planning/domain/pipe/step-status-name.pipe';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { Project } from 'src/app/shared/domain/project';

@Component({
  selector: 'app-project-card',
  imports: [
    MatCardModule, 
    MatChipsModule,  
    MatIconModule, 
    LabelModule, 
    MatButtonModule, 
    RouterLink, 
    MatTooltipModule, 
    MatProgressBarModule,
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {

  store = inject(Store);
  
  project = input.required<Project | null>();
}
