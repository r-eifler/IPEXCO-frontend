import { UserStudyCurrentDataService } from '../../user_study/service/user-study-data.service';
import { Injectable } from "@angular/core";
import { filter, take } from 'rxjs/operators';

export enum LogEvent{
  START_DEMO = "START_DEMO",
  END_DEMO = "END_DEMO",
  CREATE_ITERATION_STEP = "CREATE_ITERATION_STEP",
  COMPUTE_PLAN = "COMPUTE_PLAN",
  START_CHECK_PLAN = "START_CHECK_PLAN",
  END_CHECK_PLAN = "END_CHECK_PLAN",
  ASK_CONFLICT_QUESTION = "ASK_CONFLICT_QUESTION",
  START_CHECK_CONFLICT_EXPLANATION = "START_CHECK_CONFLICT_EXPLANATION",
  END_CHECK_CONFLICT_EXPLANATION = "END_CHECK_CONFLICT_EXPLANATION",
  ASK_RELAXATION_QUESTION = "ASK_RELAXATION_QUESTION",
  START_CHECK_RELAXATION_EXPLANATION = "START_CHECK_RELAXATION_EXPLANATION",
  END_CHECK_RELAXATION_EXPLANATION = "END_CHECK_RELAXATION_EXPLANATION",
  START_READ_TASK_INTRO = "START_READ_TASK_INTRO",
  END_READ_TASK_INTRO = "END_READ_TASK_INTRO",
  START_USE_HELP = "START_USE_HELP",
  END_USE_HELP = "END_USE_HELP",
}

export interface LogEntry {
  event: LogEvent,
  timeStamp: Date;
  info: any;
}

@Injectable({
  providedIn: "root",
})
export class TimeLoggerService {
  private logEntries: LogEntry[] = [];

  constructor(private userStudyCurrentDataService: UserStudyCurrentDataService) {

  }

  log(event: LogEvent, info = null){
    this.logEntries.push({event, timeStamp: new Date(), info})
  }

  store(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const timeLog = JSON.stringify(Array.from(this.logEntries));
      // this.userStudyCurrentDataService.getSelectedObject()
      // .pipe(filter(d => !!d), take(1))
      // .subscribe(async d => {
      //   d.timeLog = timeLog;
      //   await this.userStudyCurrentDataService.updateObject(d);
      //   resolve()
      // })
    });
  }

  reset(): void {
    this.logEntries = [];
  }
}
