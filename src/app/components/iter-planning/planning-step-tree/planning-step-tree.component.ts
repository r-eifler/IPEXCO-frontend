import { takeUntil } from "rxjs/operators";
import { RunStatus } from "../../../interface/run";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { DepExplanationRun, PlanRun } from "src/app/interface/run";
import { Observable, Subject } from "rxjs";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CurrentProjectStore,
  CurrentRunStore,
} from "src/app/store/stores.store";
import { IterationStepsService } from "src/app/service/planner-runs/iteration-steps.service";
import { SelectedPlanRunService } from "../../../service/planner-runs/selected-planrun.service";
import { SelectedQuestionService } from "../../../service/planner-runs/selected-question.service";
import { PlannerService } from "../../../service/planner-runs/planner.service";

interface RunNode {
  _id?: string;
  name: string;
  explanationRuns?: RunNode[];
  planRun?: string;
  status: RunStatus;
}

@Component({
  selector: "app-planning-step-tree",
  templateUrl: "./planning-step-tree.component.html",
  styleUrls: ["./planning-step-tree.component.scss"],
})
export class PlanningStepTreeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();
  expanded = true;

  runStatus = RunStatus;

  runs$: Observable<PlanRun[]>;

  selectedPlan: PlanRun;
  selectedQuestion: DepExplanationRun;

  treeControl = new NestedTreeControl<RunNode>((node) => node.explanationRuns);
  dataSource = new MatTreeNestedDataSource<RunNode>();

  constructor(
    private currentProjectStore: CurrentProjectStore,
    private runService: IterationStepsService,
    private selectedPlanRunService: SelectedPlanRunService,
    private selectedQuestionService: SelectedQuestionService,
    public plannerService: PlannerService
  ) {
    // TODO
    // this.runs$ = this.runService.getList();

    this.runs$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((runs) => {
      this.dataSource.data = runs;
    });
  }

  ngOnInit(): void {
    this.selectedPlanRunService
      .getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((run) => {
        this.selectedPlan = run;
        if (run) {
          // TODO
          // this.treeControl.expand(run);
        }
      });

    this.selectedQuestionService
      .getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((run) => {
        this.selectedQuestion = run;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  hasChild = (_: number, node: RunNode) =>
    !!node.explanationRuns && node.explanationRuns.length > 0;
  isPlanRun = (_: number, node: RunNode) => true; // TODO node.type === RunType.plan;
  isExpRun = (_: number, node: RunNode) => true; // TODO node.type === RunType.mugs;

  async delete(run: PlanRun) {
    // TODO
    // this.runService.deleteObject(run);
    this.selectedPlanRunService.saveObject(null);
    this.selectedQuestionService.saveObject(null);
  }

  deleteExpRun(run: DepExplanationRun) {
    // TODO
    // this.runService.deleteExpRun(run);
    this.selectedQuestionService.saveObject(null);
  }

  selectPlanRun(planRun: PlanRun): void {
    this.selectedPlanRunService.saveObject(planRun);
    this.selectedQuestionService.saveObject(null);
  }

  selectQuestion(planRunId: string, question: DepExplanationRun): void {
    // TODO
    // this.runService.getObject(planRunId)
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe(
    //     run => {
    //       this.selectedPlanRunService.saveObject(run);
    //     });
    // this.selectedQuestionService.saveObject(question);
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
