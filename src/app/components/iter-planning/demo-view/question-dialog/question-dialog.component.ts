import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ExplanationRun, PlanRun, RunType} from '../../../../interface/run';
import {PlanProperty} from '../../../../interface/plan-property/plan-property';
import {PlannerService} from '../../../../service/planner-runs/planner.service';
import {PlanRunsService} from '../../../../service/planner-runs/planruns.service';
import {DemoRunService} from '../../../../service/planner-runs/demo-planruns.service';
import {DemoPlannerService} from '../../../../service/planner-runs/demo-planner.service';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.css'],
  providers: [
    {provide: PlannerService, useClass: DemoPlannerService},
  ]
})
export class QuestionDialogComponent implements OnInit {

  private readonly currentRun: PlanRun;
  private question: PlanProperty[];

  constructor(
    private plannerService: PlannerService,
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.currentRun = data.planRun;
    this.question = data.question;
  }

  async ngOnInit(): Promise<void> {
    await this.compute_question();
  }

  async compute_question() {
    const expRun: ExplanationRun = {
      _id: this.currentRun.explanationRuns.length.toString(),
      name: 'Question ' + (this.currentRun.explanationRuns.length + 1),
      status: null,
      type: RunType.mugs,
      planProperties: this.currentRun.planProperties,
      softGoals: this.currentRun.planProperties
        .filter(p => ! this.question.includes(p) && ! this.currentRun.hardGoals.find(hg => hg === p.name))
        .map(value => (value.name)),
      hardGoals: this.currentRun.hardGoals.concat(this.question.map(value => (value.name))),
      result: null,
      log: null,
    };

    this.plannerService.execute_mugs_run(this.currentRun, expRun);
  }

  onBack(): void {
    this.dialogRef.close();
  }

}
