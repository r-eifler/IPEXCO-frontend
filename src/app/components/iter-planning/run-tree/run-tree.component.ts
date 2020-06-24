import { takeUntil } from 'rxjs/operators';
import { RunStatus } from '../../../interface/run';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RunType, PlanRun, ExplanationRun } from 'src/app/interface/run';
import { Observable, Subject } from 'rxjs';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentProjectStore, CurrentRunStore } from 'src/app/store/stores.store';
import { RunService } from 'src/app/service/run-services';


interface RunNode {
  _id: string;
  name: string;
  explanationRuns?: RunNode[];
  type: RunType;
  planRun?: string;
  status: RunStatus;
}

@Component({
  selector: 'app-run-tree',
  templateUrl: './run-tree.component.html',
  styleUrls: ['./run-tree.component.scss']
})
export class RunTreeComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  runStatus = RunStatus;

  runs$: Observable<PlanRun[]>;

  treeControl = new NestedTreeControl<RunNode>(node => node.explanationRuns);
  dataSource = new MatTreeNestedDataSource<RunNode>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private currentProjectStore: CurrentProjectStore,
    private runService: RunService,
    private currentRunStore: CurrentRunStore,
  ) {
    this.runs$ = this.runService.getList();

    this.runs$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      this.dataSource.data = value;
      console.log('Run Tree data:');
      console.log(value);
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

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
    if (this.currentRunStore.item$.getValue() && run._id === this.currentRunStore.item$.getValue()._id) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  deleteExpRun(run: ExplanationRun) {
    this.runService.deleteExpRun(run);
  }

}
