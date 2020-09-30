import {Component, Input, OnInit} from '@angular/core';
import {UserStudyData} from '../../../../interface/user-study/user-study';
import {PlanRunsService} from '../../../../service/planner-runs/planruns.service';

@Component({
  selector: 'app-individual-run-user-data',
  templateUrl: './individual-run-user-data.component.html',
  styleUrls: ['./individual-run-user-data.component.css']
})
export class IndividualRunUserDataComponent implements OnInit {

  view: any[] = [1000, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ['#02496f']
  };

  dataEntries: UserStudyData[] = [];
  planRunData: any[];
  explanationRunData: any[];

  @Input()
  set data(entries: UserStudyData[]) {
    this.dataEntries = entries;
    this.getRunTimeline();
  }

  constructor(
    private planRunService: PlanRunsService
  ) { }

  ngOnInit(): void {
  }

  getRunTimeline() {
    this.planRunData = [];
    for (const entry of this.dataEntries) {
      for (const planRun of entry.planRuns) {
        const dataPoint = {
          name: planRun.run.name,
          value: this.planRunService.getPlanUtility(planRun.run)
        };
        this.planRunData.push(dataPoint);
      }
    }

    this.explanationRunData = [];
    for (const entry of this.dataEntries) {
      for (const planRun of entry.planRuns) {
        const dataPoint = {
          name: planRun.run.name,
          value: planRun.run.explanationRuns.length
        };
        this.explanationRunData.push(dataPoint);
      }
    }
  }
}
