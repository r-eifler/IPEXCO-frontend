import {Component, Input, OnInit} from '@angular/core';
import {UserStudyData} from '../../../../interface/user-study/user-study';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-overview-data',
  templateUrl: './overview-data.component.html',
  styleUrls: ['./overview-data.component.css']
})
export class OverviewDataComponent implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject();

  view: any[] = [700, 400];

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

  @Input()
  set data(entries: UserStudyData[]) {
    this.dataEntries = entries;
    this.getPlansData();
    this.getQuestionData();
  }


  plansData: any[];
  questionData: any[];

  constructor() { }

  ngOnInit(): void {
  }

  getPlansData() {
    this.plansData = [];
    for (const entry of this.dataEntries) {
      this.plansData.push({
        name: entry.user.prolificId !== '000000' ? entry.user.prolificId : entry.user._id.slice(-5),
        value: entry.planRuns.length
      });
    }
  }

  getQuestionData() {
    this.questionData = [];
    for (const entry of this.dataEntries) {
      this.questionData.push({
        name: entry.user.prolificId !== '000000' ? entry.user.prolificId : entry.user._id.slice(-5),
        value: entry.expRuns.length
      });
    }
  }

}
