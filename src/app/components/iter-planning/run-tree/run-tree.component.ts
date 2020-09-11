import {takeUntil} from 'rxjs/operators';
import {RunStatus} from '../../../interface/run';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExplanationRun, PlanRun, RunType} from 'src/app/interface/run';
import {Observable, Subject} from 'rxjs';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentProjectStore, CurrentRunStore} from 'src/app/store/stores.store';
import {PlanRunsService} from 'src/app/service/planner-runs/planruns.service';
import {SelectedPlanRunService} from '../../../service/planner-runs/selected-planrun.service';
import {SelectedQuestionService} from '../../../service/planner-runs/selected-question.service';
import {PlannerService} from '../../../service/planner-runs/planner.service';


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
  expanded = true;

  runStatus = RunStatus;

  runs$: Observable<PlanRun[]>;

  selectedPlan: PlanRun;
  selectedQuestion: ExplanationRun;

  treeControl = new NestedTreeControl<RunNode>(node => node.explanationRuns);
  dataSource = new MatTreeNestedDataSource<RunNode>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private currentProjectStore: CurrentProjectStore,
    private runService: PlanRunsService,
    private selectedPlanRunService: SelectedPlanRunService,
    private selectedQuestionService: SelectedQuestionService,
    public plannerService: PlannerService,
  ) {
    this.runs$ = this.runService.getList();

    this.runs$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        runs => {
          this.dataSource.data = runs;
        });
  }

  ngOnInit(): void {
    this.selectedPlanRunService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        run => {
          this.selectedPlan = run;
          if (run) {
            this.treeControl.expand(run);
          }
        });

    this.selectedQuestionService.getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        run => {
          this.selectedQuestion = run;
        });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  hasChild = (_: number, node: RunNode) => !!node.explanationRuns && node.explanationRuns.length > 0;
  isPlanRun = (_: number, node: RunNode) => node.type === RunType.plan;
  isExpRun = (_: number, node: RunNode) => node.type === RunType.mugs;


  async delete(run: PlanRun) {
    this.runService.deleteObject(run);
    this.selectedPlanRunService.saveObject(null);
    this.selectedQuestionService.saveObject(null);
  }

  deleteExpRun(run: ExplanationRun) {
    this.runService.deleteExpRun(run);
    this.selectedQuestionService.saveObject(null);
  }

  selectPlanRun(planRun: PlanRun): void {
    this.selectedPlanRunService.saveObject(planRun);
    this.selectedQuestionService.saveObject(null);
  }

  selectQuestion(planRunId: string, question: ExplanationRun): void {
    this.runService.getObject(planRunId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        run => {
          this.selectedPlanRunService.saveObject(run);
        });
    this.selectedQuestionService.saveObject(question);
  }

  toggleExpand() {
    this.expanded = ! this.expanded;
  }

}
