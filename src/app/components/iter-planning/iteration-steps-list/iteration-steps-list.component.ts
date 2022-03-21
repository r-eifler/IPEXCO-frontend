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

  constructor(
    private iterationStepsService: IterationStepsService,
    private selectedIterationStepService: SelectedIterationStepService
  ) {

    this.steps$ = iterationStepsService.getList();

  }

  ngOnInit(): void {
  }

}
