import { Component, computed, inject, input, Signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IterationStep, StepStatus } from '../../domain/iteration_step';
import { PlanProperty } from 'src/app/shared/domain/plan-property/plan-property';
import { DemoDirective } from '../../derectives/isDemo.directive';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TaskInformationDialogComponent } from '../../view/task-information-dialog/task-information-dialog.component';

@Component({
  selector: 'app-steps-list-hero',
  imports: [
    MatCardModule,
    MatIconModule,
    DemoDirective,
    MatButtonModule
  ],
  templateUrl: './steps-list-hero.component.html',
  styleUrl: './steps-list-hero.component.scss'
})
export class StepsListHeroComponent {

  dialog = inject(MatDialog);

  planPropertiesMap = input.required<Record<string,PlanProperty>>();
  steps = input.required<IterationStep[]>();

  maxOverallUtility = input.required<number>();
  currentMaxUtility = input.required<number>();

  numSolvedSteps = computed(() => this.steps()?.filter(s => s.status === StepStatus.solvable).length)
  umUnSolvedSteps = computed(() => this.steps()?.filter(s => s.status === StepStatus.unsolvable).length)

  openTaskInfo(){
   this.dialog.open(TaskInformationDialogComponent);
  }
}
