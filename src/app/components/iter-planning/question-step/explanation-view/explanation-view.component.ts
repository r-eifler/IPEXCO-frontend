import { PlanProperty } from './../../../../interface/plan-property';
import { DisplayTaskService } from './../../../../service/display-task.service';
import { takeUntil } from 'rxjs/operators';
import { CurrentQuestionService } from 'src/app/service/run-services';
import { CurrentRunService } from './../../../../service/run-services';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { Observable, combineLatest, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlanRun, ExplanationRun } from 'src/app/interface/run';

interface Answer {
  MUGS: string[];
}

@Component({
  selector: 'app-explanation-view',
  templateUrl: './explanation-view.component.html',
  styleUrls: ['./explanation-view.component.css']
})
export class ExplanationViewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<ExplanationRun>;

  displayMUGS: string[][] = [];

  constructor(
    private  currentRunService: CurrentRunService,
    private currentQuestionService: CurrentQuestionService,
    private planPropertiesService: PlanPropertyCollectionService,
    private displayTaskService: DisplayTaskService) {

    this.currentRun$ = this.currentRunService.getSelectedObject();
    this.currentQuestion$ = this.currentQuestionService.getSelectedObject();
  }

  ngOnInit(): void {
    combineLatest([this.currentQuestion$, this.planPropertiesService.getList(), this.displayTaskService.getSelectedObject()])
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      ([expRun, planProperties, displayTask]) => {
        if (expRun && planProperties && displayTask) {
          this.displayMUGS = [];
          console.log(expRun.mugs);
          for (const entry of expRun.mugs) {
            const displayEntry: string[] = [];
            for (const fact of entry) {
              const pp: PlanProperty = planProperties.find(p => p.name === fact);
              if (pp) {
                displayEntry.push(pp.naturalLanguageDescription);
              } else {
                // for now ignore goal facts in question
                displayEntry.push('goal fact');
              }
            }
            if (displayEntry.length === 0){
              this.displayMUGS = null;
              return;
            }
            this.displayMUGS.push(displayEntry);
          }
          console.log(this.displayMUGS);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
