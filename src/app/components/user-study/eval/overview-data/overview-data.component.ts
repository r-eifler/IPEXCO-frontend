import { Component, Input, OnInit } from "@angular/core";
import {
  UserStudyData,
  UserStudyDemoData,
} from "../../../../interface/user-study/user-study";
import { Subject } from "rxjs";
import { Demo } from "../../../../interface/demo";

@Component({
  selector: "app-overview-data",
  templateUrl: "./overview-data.component.html",
  styleUrls: ["./overview-data.component.css"],
})
export class OverviewDataComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  showPlots = true;

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ["#02496f"],
  };

  dataEntries: UserStudyData[] = [];
  selectedDemoId: string;

  @Input()
  set demoId(id: string) {
    this.selectedDemoId = id;
    this.update();
  }

  @Input()
  set data(entries: UserStudyData[]) {
    this.dataEntries = entries;
    this.update();
  }

  plansData: any[];
  questionData: any[];

  constructor() {}

  ngOnInit(): void {}

  update() {
    this.showPlots = false;
    this.plansData = [];
    this.questionData = [];
    for (const entry of this.dataEntries) {
      const demoData: UserStudyDemoData = entry.demosData.find(
        (e) => e.demoId === this.selectedDemoId
      )?.data;
      if (!demoData) {
        return;
      }
      const displayId =
        entry.user.prolificId !== "000000"
          ? entry.user.prolificId
          : entry.user._id.slice(-5);
      this.plansData.push({
        name: displayId,
        value: demoData.planRuns.length,
      });
      this.questionData.push({
        name: displayId,
        value: demoData.expRuns.length,
      });
    }
    window.setTimeout(() => (this.showPlots = true), 200);
  }
}
