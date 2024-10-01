import { ExplanationInterfaceType } from '../../../../interface/settings/general-settings';
import { GeneralSettings } from 'src/app/interface/settings/general-settings';
import { CurrentProjectService } from "src/app/service/project/project-services";
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { FinishedStepInterfaceStatusService } from "../../../../service/user-interface/interface-status-services";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { filter, map, takeUntil, find, take, tap } from "rxjs/operators";
import {
  FinishedStepInterfaceStatus,
} from "src/app/interface/interface-status";
import { IterationStep } from 'src/app/iterative_planning/domain/iteration_step';
import { Store } from '@ngrx/store';
import { selectIterativePlanningProject, selectIterativePlanningSelectedStep } from 'src/app/iterative_planning/state/iterative-planning.selector';

@Component({
  selector: "app-finished-step-navigator",
  templateUrl: "./finished-step-navigator.component.html",
  styleUrls: ["./finished-step-navigator.component.scss"],
})
export class FinishedStepNavigatorComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<any> = new Subject();

  step$: Observable<IterationStep>;
  showTab$: Observable<number>;
  iterfaceStatus$: Observable<FinishedStepInterfaceStatus[]>;
  settings$: Observable<GeneralSettings>;

  ExplanationType = ExplanationInterfaceType;

  constructor(
    private store: Store,
    private finishedStepInterfaceStatusService: FinishedStepInterfaceStatusService,
  ) {

    this.step$ = this.store.select(selectIterativePlanningSelectedStep)
    this.iterfaceStatus$ = this.finishedStepInterfaceStatusService.getList();

    this.settings$ = this.store.select(selectIterativePlanningProject).pipe(
      map(p => p?.settings)
    );

    this.showTab$ = combineLatest([this.step$, this.iterfaceStatus$]).pipe(
      takeUntil(this.unsubscribe$),
      filter(([step, stati]) => !!step && !!stati),
      map(([step, stati]) => {
        let status: FinishedStepInterfaceStatus = stati.find(
          (s) => s._id == step._id
        );
        if (status) {
          return status.tab;
        }
        status = {
          _id: step._id,
          tab: 0,
          question: null,
          conflict: null,
          dependencies: null,
          viewPos: 0,
        };
        this.finishedStepInterfaceStatusService.saveObject(status);
        return 1;
      })
    );
  }

  setTab(tab: number) {
    combineLatest([this.step$, this.iterfaceStatus$])
      .pipe(
        filter(([step, stati]) => !!step && !!stati),
        take(1)
      )
      .subscribe(([step, stati]) => {
        let status: FinishedStepInterfaceStatus = stati.find(
          (s) => s._id == step._id
        );
        if (status) {
          let newStatus = { ...status, tab };
          console.log(newStatus);
          this.finishedStepInterfaceStatusService.saveObject(newStatus);
        }
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
