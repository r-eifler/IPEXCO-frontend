import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { LabelModule } from 'src/app/shared/components/label/label.module';
import { Project } from 'src/app/shared/domain/project';
import { BelugaProblemZ } from '../../../shared/domain/beluga_problem';

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
  
  project = input.required<Project>();

  belugaTask = computed(() => {
    console.log(this.project())
    return this.project()?.baseTask?.model != null ? BelugaProblemZ.parse(this.project()?.baseTask?.model) : null
  })

  numFlights = computed(() => this.belugaTask()?.flights.length)
  numRacks = computed(() => this.belugaTask()?.racks.length)
  numJigs= computed(() => {
    let jigs = this.belugaTask()?.jigs
    return jigs != undefined ? Object.keys(jigs).length : null
  })
}
