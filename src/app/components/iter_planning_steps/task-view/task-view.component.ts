import { Component, OnInit, Input } from '@angular/core';
import {Run} from '../../../_interface/run';
import {PlanProperty} from '../../../_interface/plan-property';
import {BehaviorSubject, Observable} from 'rxjs';
import {Project} from '../../../_interface/project';
import {CurrentProjectService, IterPlanningStepService, PlanPropertyCollectionService} from '../../../_service/general-services';
import {PlannerService} from '../../../_service/planner.service';
import {IterPlanningStep} from '../../../_interface/iter-planning-step';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {IHTTPData} from '../../../_interface/http-data.interface';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

  @Input() softProperties: PlanProperty[] = [];
  @Input() hardProperties: PlanProperty[] = [];
  @Input() project: Project;

  constructor() {}

  ngOnInit(): void {
  }


}
