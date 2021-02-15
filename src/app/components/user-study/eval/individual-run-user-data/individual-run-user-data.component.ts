import {Component, Input, OnInit} from '@angular/core';
import {UserStudyData, UserStudyDemoData} from '../../../../interface/user-study/user-study';
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
  selectedDemoId: string;

  @Input()
  set demoId(id: string) {
    this.selectedDemoId = id;
    this.getRunTimeline();
  }

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
    this.explanationRunData = [];
    for (const entry of this.dataEntries) {
      const demoData: UserStudyDemoData = entry.demosData.find(e => e.demoId === this.selectedDemoId)?.data;
      if (! demoData) {
        return;
      }
      for (const planRun of demoData.planRuns) {
        const dataPointU = {
          name: planRun.run.name,
          value: this.planRunService.getPlanUtility(planRun.run)
        };
        this.planRunData.push(dataPointU);
        const dataPointN = {
          name: planRun.run.name,
          value: planRun.run.explanationRuns.length
        };
        this.explanationRunData.push(dataPointN);
      }
    }
  }
}
