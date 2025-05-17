import { Component, computed, input } from '@angular/core';
import { BelugaConfiguration } from '../../domain/flight-section';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExplanationRunStatus } from 'src/app/iterative_planning/domain/explanation/explanations';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-configuration-selector',
  imports: [
    MatIconModule,
    MatButtonModule,
    NgClass,
    RouterLink,
  ],
  templateUrl: './configuration-selector.component.html',
  styleUrl: './configuration-selector.component.scss'
})
export class ConfigurationSelectorComponent {

  configuration = input.required<BelugaConfiguration>();
  routerLink = input.required<string>();
  selected = input<boolean>(false);

  solvable = computed(() => this.configuration().explanationStatus === ExplanationRunStatus.FINISHED && this.configuration().explanations?.MUGS.length == 0)
  hasConflict = computed(() => this.configuration().explanationStatus === ExplanationRunStatus.FINISHED && (this.configuration().explanations?.MUGS.length ?? 1) > 0)
  pending = computed(() => this.configuration().explanationStatus === ExplanationRunStatus.PENDING)

  icon = computed(() => {
    if(this.configuration().explanationStatus === ExplanationRunStatus.PENDING){
      return 'question_mark'
    }
    if(this.configuration().explanationStatus === ExplanationRunStatus.RUNNING){
      return 'timer'
    }
    if(this.configuration().explanationStatus === ExplanationRunStatus.FINISHED){
      if(this.configuration().explanations?.MUGS.length == 0){
        return 'check'
      }
      else{
        return 'warning'
      }
    }
    return 'bug_report'
  })

  color = computed(() => {
    if(this.configuration().explanationStatus === ExplanationRunStatus.PENDING){
      return 'neutral'
    }
    if(this.configuration().explanationStatus === ExplanationRunStatus.FINISHED){
      if(this.configuration().explanations?.MUGS.length == 0){
        return 'secondary'
      }
      else{
        return 'error'
      }
    }
    return 'neutral'
  })

}
