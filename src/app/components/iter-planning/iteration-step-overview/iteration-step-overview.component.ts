import { BehaviorSubject } from 'rxjs';
import { IterationStep } from './../../../interface/run';
import { SelectedIterationStepService } from './../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iteration-step-overview',
  templateUrl: './iteration-step-overview.component.html',
  styleUrls: ['./iteration-step-overview.component.scss']
})
export class IterationStepOverviewComponent implements OnInit {

  step$: BehaviorSubject<IterationStep>;

  constructor(
    private workingIterationStepService: SelectedIterationStepService
  ) {

    this.step$ = workingIterationStepService.findSelectedObject();

  }

  ngOnInit(): void {
  }

}
