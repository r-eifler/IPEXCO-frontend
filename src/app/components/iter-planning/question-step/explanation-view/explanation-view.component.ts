import { takeUntil } from 'rxjs/operators';
import { CurrentQuestionService } from 'src/app/service/run-services';
import { CurrentRunService } from './../../../../service/run-services';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { Observable, combineLatest, Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PddlFileUtilsService } from 'src/app/service/pddl-file-utils.service';
import { CurrentRunStore, CurrentQuestionStore } from 'src/app/store/stores.store';
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

  currentRun$: Observable<PlanRun>;
  currentQuestion$: Observable<ExplanationRun>;

  constructor(
    private  currentRunService: CurrentRunService,
    private currentQuestionService: CurrentQuestionService) {

    this.currentRun$ = this.currentRunService.getSelectedObject();
    this.currentQuestion$ = this.currentQuestionService.getSelectedObject();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
