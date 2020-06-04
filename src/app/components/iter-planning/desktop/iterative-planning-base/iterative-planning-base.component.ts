import { RunType, ExplanationRun } from '../../../../interface/run';
import { Component, OnInit } from '@angular/core';
import {CurrentRunService, RunService} from '../../../../service/run-services';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentProjectStore, CurrentRunStore, RunsStore} from '../../../../store/stores.store';
import {PlanRun} from '../../../../interface/run';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';


/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface RunNode {
  _id: string;
  name: string;
  explanationRuns?: RunNode[];
  type: RunType;
  planRun?: string;
}


@Component({
  selector: 'app-iterative-planning-base',
  templateUrl: './iterative-planning-base.component.html',
  styleUrls: ['./iterative-planning-base.component.css']
})
export class IterativePlanningBaseComponent implements OnInit {

  runs$: Observable<PlanRun[]>;
  private project;

  treeControl = new NestedTreeControl<RunNode>(node => node.explanationRuns);
  dataSource = new MatTreeNestedDataSource<RunNode>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private currentProjectStore: CurrentProjectStore,
    private runService: RunService,
    private runStore: RunsStore,
    private currentRunStore: CurrentRunStore,
  ) {
    this.runs$ = this.runStore.items$;

    this.runs$.subscribe(value => {
      this.dataSource.data = value;
      console.log(value);
      if (value.length === 0) {
        this.router.navigate(['./original-task'], { relativeTo: this.route });
      } else {
        const lastRun: PlanRun = value[value.length - 1];
        this.router.navigate(['./planning-step', lastRun._id], { relativeTo: this.route });
      }
    });

    this.currentProjectStore.item$.subscribe(value => {
      if (value !== null) {
        this.project = value;
        this.runService.findCollection([{param: 'projectId', value: this.project._id}]);
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

  hasChild = (_: number, node: RunNode) => !!node.explanationRuns && node.explanationRuns.length > 0;
  isPlanRun = (_: number, node: RunNode) => node.type === RunType.plan;
  isExpRun = (_: number, node: RunNode) => node.type === RunType.mugs;

  new_planning_step() {

  }

  new_question(planRun: RunNode) {
    this.router.navigate(['./new_question'], { relativeTo: this.route });
  }

  delete(run: PlanRun) {
    this.runService.deleteObject(run);
    if (run._id === this.currentRunStore.item$.getValue()._id) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  deleteExpRun(run: ExplanationRun) {
    this.runService.deleteExpRun(run);
  }

}
