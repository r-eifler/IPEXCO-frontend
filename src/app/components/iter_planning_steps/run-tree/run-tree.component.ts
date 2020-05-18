import { Component, OnInit } from '@angular/core';
import { RunType, PlanRun, ExplanationRun } from 'src/app/interface/run';
import { Observable } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentProjectStore, RunsStore, CurrentRunStore } from 'src/app/store/stores.store';
import { RunService } from 'src/app/service/run-services';

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
  selector: 'app-run-tree',
  templateUrl: './run-tree.component.html',
  styleUrls: ['./run-tree.component.css']
})
export class RunTreeComponent implements OnInit {

  runs$: Observable<PlanRun[]>;

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
      // mayby used in the desktop version
      // if (value.length === 0) {
      //   this.router.navigate(['./original-task'], { relativeTo: this.route });
      // } else {
      //   const lastRun: PlanRun = value[value.length - 1];
      //   this.router.navigate(['./planning-step', lastRun._id], { relativeTo: this.route });
      // }
    });

  }

  ngOnInit(): void {
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
