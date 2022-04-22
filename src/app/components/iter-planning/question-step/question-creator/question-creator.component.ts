import { PlanProperty } from "src/app/interface/plan-property/plan-property";
import { takeUntil } from "rxjs/operators";
import { QUESTION_REDIRECT } from "../../../../app.tokens";
import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Project } from "../../../../interface/project";
import { PlannerService } from "../../../../service/planner-runs/planner.service";
import { DepExplanationRun, PlanRun } from "../../../../interface/run";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { CurrentProjectService } from "src/app/service/project/project-services";
import { MatSelectionList } from "@angular/material/list/selection-list";
import { ActivatedRoute, Router } from "@angular/router";
import { SelectedPlanRunService } from "../../../../service/planner-runs/selected-planrun.service";
import { TimeLoggerService } from "../../../../service/logger/time-logger.service";

@Component({
  selector: "app-question-creator",
  templateUrl: "./question-creator.component.html",
  styleUrls: ["./question-creator.component.css"],
})
export class QuestionCreatorComponent implements OnInit, OnDestroy {
  private loggerId: number;
  private ngUnsubscribe: Subject<any> = new Subject();

  public solved: boolean;

  @Output() finished = new EventEmitter<boolean>();

  @ViewChild("planPropertiesList") questionSelectionList: MatSelectionList;
  question: PlanProperty[] = [];

  allPlanProperties: PlanProperty[];
  notSatPlanProperties: PlanProperty[];
  private currentRun: PlanRun;
  private hardGoals: string[];
  private globalHardGoals: PlanProperty[];

  public currentProject: Project;

  public maxSizeQuestionReached = false;

  constructor(
    private timeLogger: TimeLoggerService,
    private propertiesService: PlanPropertyMapService,
    private currentProjectService: CurrentProjectService,
    private plannerService: PlannerService,
    private currentRunService: SelectedPlanRunService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(QUESTION_REDIRECT) private redirectURL: string
  ) {
    this.currentProjectService
      .getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((project) => {
        this.currentProject = project;
      });

    this.currentRunService
      .getSelectedObject()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((run) => {
        if (run) {
          // this.solved = !!run.plan;
          if (!this.loggerId) {
            this.loggerId = this.timeLogger.register("question-creator");
          }
          this.timeLogger.addInfo(this.loggerId, "runId: " + run._id);

          this.currentRun = run;
          this.hardGoals = []; // TODO run.hardGoals;

          this.propertiesService
            .getMap()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((properties) => {
              this.allPlanProperties = [...properties.values()].filter(
                (p) => p.isUsed
              );
              if (this.solved) {
                this.notSatPlanProperties = []; // TODO this.allPlanProperties.filter(
                // p => !this.currentRun.satPlanProperties.includes(p.name) && !this.currentRun.hardGoals.includes(p.name));
              } else {
                this.globalHardGoals = this.allPlanProperties.filter(
                  (p) => p.isUsed && p.globalHardGoal
                );
              }
            });
        }
      });
  }

  ngOnInit(): void {
    if (!this.loggerId) {
      this.loggerId = this.timeLogger.register("question-creator");
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.timeLogger.deregister(this.loggerId);
  }

  onSelectionChange(event) {
    this.question = this.questionSelectionList.selectedOptions.selected.map(
      (v) => v.value
    );
    this.maxSizeQuestionReached =
      this.questionSelectionList.selectedOptions.selected.length >=
      this.currentProject.settings.maxQuestionSize;
  }

  // create a new explanation run with the currently selected properties
  async compute_dependencies() {
    // const expRun: DepExplanationRun = {
    //   _id: "0000", // this.currentRun.explanationRuns.length.toString(),
    //   name: 'Question ?? ', // TODO + (this.currentRun.explanationRuns.length + 1),
    //   status: null,
    //   softGoals: this.allPlanProperties
    //     .filter(p => ! this.question.includes(p)),
    //   hardGoals: this.question,
    //   result: null,
    //   log: null,
    // };
    // // this.plannerService.computeMUGS(this.currentRun, expRun);
    // //await this.router.navigate([this.redirectURL], { relativeTo: this.route });
    // this.finished.emit(true);
    // this.timeLogger.addInfo(this.loggerId, 'question asked');
  }

  async compute_dependencies_unsolvable() {
    // const globalHardGoalNames = this.globalHardGoals.map(p => p.name);
    // const expRun: DepExplanationRun = {
    //   _id: "0000", // TODO this.currentRun.explanationRuns.length.toString(),
    //   name: 'Question ?', // TODO + (this.currentRun.explanationRuns.length + 1),
    //   status: null,
    //   //planProperties: this.allPlanProperties.filter(p => this.hardGoals.find( hg => hg === p.name)),
    //   softGoals: [], //this.hardGoals.filter(hg => ! globalHardGoalNames.find( ghg => hg === ghg)),
    //   hardGoals: [], //globalHardGoalNames,
    //   result: null,
    //   log: null,
    // };
    // // this.plannerService.computeMUGS(this.currentRun, expRun);
    // //await this.router.navigate([this.redirectURL], { relativeTo: this.route });
    // this.finished.emit(true);
    // this.timeLogger.addInfo(this.loggerId, 'question asked');
  }

  abortWithoutQuestion() {
    this.finished.emit(false);
    this.timeLogger.addInfo(this.loggerId, "abort");
  }
}
