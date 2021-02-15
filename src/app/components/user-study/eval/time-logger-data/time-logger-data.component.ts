import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {UserStudyData} from '../../../../interface/user-study/user-study';
import {LogEntry} from '../../../../service/logger/time-logger.service';

@Component({
  selector: 'app-time-logger-data',
  templateUrl: './time-logger-data.component.html',
  styleUrls: ['./time-logger-data.component.css']
})
export class TimeLoggerDataComponent implements OnInit {

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
  private selectedDemoId: string;

  @Input()
  set demoId(id: string) {
    this.selectedDemoId = id;
    this.getAvgTimeLogData();
  }

  @Input()
  set data(entries: UserStudyData[]) {
    this.dataEntries = entries;
    this.getAvgTimeLogData();
  }

  avgTimeLogData: any[];

  constructor() { }

  ngOnInit(): void {
  }

  getAvgTimeLogData() {
    const dataMap = new Map<string, number>();

    for (const data of this.dataEntries) {
      if (!data.user.timeLog) {
        continue;
      }
      const logData: LogEntry[] = JSON.parse(data.user.timeLog);

      for (const entry of logData) {
        if (! entry.start || ! entry.end) {
          continue;
        }
        const startDate = new Date(entry.start);
        const endDate = new Date(entry.end);
        const timeDiff = endDate.getTime() - startDate.getTime();
        if (! dataMap.has(entry.componentName)) {
          dataMap.set(entry.componentName, 0);
        }
        dataMap.set(entry.componentName, dataMap.get(entry.componentName) + timeDiff);
      }
    }

    this.avgTimeLogData = [];
    for (const entry of dataMap.entries()) {

      this.avgTimeLogData.push({
        name: entry[0],
        value: entry[1]
      });
    }
  }

}
