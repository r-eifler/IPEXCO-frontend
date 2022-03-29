import { MatSelectionListChange } from '@angular/material/list';
import { IterationStep } from './../../../interface/run';
import { SelectedIterationStepService } from './../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit } from '@angular/core';
import { IterationStepsService } from 'src/app/service/planner-runs/iteration-steps.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-iteration-steps-list',
  templateUrl: './iteration-steps-list.component.html',
  styleUrls: ['./iteration-steps-list.component.scss']
})
export class IterationStepsListComponent implements OnInit {

  steps$: Observable<IterationStep[]>;
  selected$: Observable<IterationStep>;

  constructor(
    private iterationStepsService: IterationStepsService,
    private selectedIterationStepService: SelectedIterationStepService
  ) {

    this.steps$ = iterationStepsService.getList();
    this.selected$ = selectedIterationStepService.findSelectedObject();

  }

  ngOnInit(): void {
  }

  selectStep(event: MatSelectionListChange): void {
    let step = event.options[0].value as IterationStep
    this.selectedIterationStepService.saveObject(step);
  }

}
