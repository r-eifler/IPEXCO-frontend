import { CurrentProjectService } from 'src/app/service/project/project-services';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { FinishedStepInterfaceStatusService } from './../../../../service/user-interface/interface-status-services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { filter, map, takeUntil, find, take } from 'rxjs/operators';
import { IterationStep } from 'src/app/interface/run';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { FinishedStepInterfaceStatus, NewStepInterfaceStatus } from 'src/app/interface/interface-status';

@Component({
  selector: 'app-finished-step-navigator',
  templateUrl: './finished-step-navigator.component.html',
  styleUrls: ['./finished-step-navigator.component.scss']
})
export class FinishedStepNavigatorComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  step$: BehaviorSubject<IterationStep>;
  showTab$: Observable<number>;
  iterfaceStatus$: Observable<FinishedStepInterfaceStatus[]>;
  showConflicts$: Observable<boolean>;

  constructor(
    private selectedIterationStepService: SelectedIterationStepService,
    private finishedStepInterfaceStatusService: FinishedStepInterfaceStatusService,
    private currentProjectService: CurrentProjectService,
  ) {
    this.step$ = this.selectedIterationStepService.getSelectedObject();
    this.iterfaceStatus$ = this.finishedStepInterfaceStatusService.getList();

    this.showConflicts$ = this.currentProjectService.getSelectedObject().
      pipe(
        filter(p => !!p),
        map(project => project.settings.allowQuestions)
      );


    this.showTab$ = combineLatest([this.step$, this.iterfaceStatus$]).pipe(
      filter(([step, stati]) => !!step && !!stati),
      map(([step, stati]) =>{
        let status: FinishedStepInterfaceStatus = stati.find(s => s._id == step._id);
        if(status){
          return status.tab;
        }
        status = {_id: step._id, tab: 1, question: null, conflict: null, dependencies: null, viewPos: 0};
        this.finishedStepInterfaceStatusService.saveObject(status);
        return 1;
      })
    );
  }

  setTab(tab: number) {
    combineLatest([this.step$, this.iterfaceStatus$]).pipe(
      filter(([step, stati]) => !!step && !!stati),
      take(1)).
      subscribe(([step, stati]) =>{
        let status: FinishedStepInterfaceStatus = stati.find(s => s._id == step._id);
        if(status){
          let newStatus = {...status, tab};
          console.log(newStatus);
          this.finishedStepInterfaceStatusService.saveObject(newStatus);
        }
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.finishedStepInterfaceStatusService.clear();
  }

}
