import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { IterationStep } from './../../../interface/run';
import { BehaviorSubject } from 'rxjs';
import { SelectedIterationStepService } from './../../../service/planner-runs/selected-iteration-step.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iteration-step-detail-navigator',
  templateUrl: './iteration-step-detail-navigator.component.html',
  styleUrls: ['./iteration-step-detail-navigator.component.scss']
})
export class IterationStepDetailNavigatorComponent implements OnInit {

  step$: BehaviorSubject<IterationStep>;
  showTab = 1;

  constructor(
    private selectedIterationStepService: SelectedIterationStepService
  ) {
    this.step$ = selectedIterationStepService.getSelectedObject();
  }

  ngOnInit(): void {
  }

}
