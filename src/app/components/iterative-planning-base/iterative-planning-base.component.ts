import { Component, OnInit } from '@angular/core';
import {CurrentRunService, RunService} from '../../_service/general-services';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentProjectStore, CurrentRunStore, RunsStore} from '../../store/stores.store';
import {PlanRun} from '../../_interface/run';

@Component({
  selector: 'app-iterative-planning-base',
  templateUrl: './iterative-planning-base.component.html',
  styleUrls: ['./iterative-planning-base.component.css']
})
export class IterativePlanningBaseComponent implements OnInit {

  // project: Project;
  runs$: Observable<PlanRun[]>;
  private project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private currentProjectStore: CurrentProjectStore,
    private iterPlanningStepService: RunService,
    private runStore: RunsStore,
    private currentRunStore: CurrentRunStore,
  ) {
    this.runs$ = this.runStore.items$;

    this.currentProjectStore.item$.subscribe(value => {
      if (value !== null) {
        this.project = value;
        this.iterPlanningStepService.findCollection([{param: 'projectId', value: this.project._id}]);
      }
    });
  }

  ngOnInit(): void {
    // this.runs$.subscribe(value => {
    //   if (value.length === 0) {
    //     this.router.navigate(['original-task']).then(r => console.log('Go to original task.'));
    //   }
    // });
  }

  new_planning_step() {

  }

  new_question() {
    this.router.navigate(['./new_question'], { relativeTo: this.route });
  }

  delete(run: PlanRun) {
    this.iterPlanningStepService.deleteObject(run);
    if (run._id === this.currentRunStore.item$.getValue()._id) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

}
