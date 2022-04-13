import { PlanningTaskRelaxationSpace } from './../../../../interface/planning-task-relaxation';
import { PlanningTaskRelaxationService } from './../../../../service/planning-task/planning-task-relaxations-services';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { DepExplanationRun, getDependencies, IterationStep } from 'src/app/interface/run';
import { PPConflict, PPDependencies } from './../../../../interface/explanations';
import { PlanProperty } from './../../../../interface/plan-property/plan-property';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { PlannerService } from 'src/app/service/planner-runs/planner.service';
import { FinishedStepInterfaceStatusService } from 'src/app/service/user-interface/interface-status-services';
import { FinishedStepInterfaceStatus } from 'src/app/interface/interface-status';

@Component({
  selector: 'app-explanations-view',
  templateUrl: './explanations-view.component.html',
  styleUrls: ['./explanations-view.component.scss']
})
export class ExplanationsViewComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();

  selectedPP: string;
  questions$ = new BehaviorSubject<PlanProperty>(null);
  selectedConflict$ = new BehaviorSubject<PPConflict>(null);

  step$ : Observable<IterationStep>;
  iterfaceStati$: Observable<FinishedStepInterfaceStatus[]>;
  interfaceStatus: FinishedStepInterfaceStatus;
  computedDependencies$ = new BehaviorSubject<PPDependencies>(null);
  plannerBusy$ : BehaviorSubject<boolean>;
  displayExplanations$ : Observable<boolean>;
  planPropertiesMap$: BehaviorSubject<Map<string, PlanProperty>>;
  relaxationSpaces$: BehaviorSubject<PlanningTaskRelaxationSpace[]>;

  viewpos = 1;

  constructor(
    selectedIterationStepService: SelectedIterationStepService,
    planpropertiesService: PlanPropertyMapService,
    planningTaskRelaxationService: PlanningTaskRelaxationService,
    private finishedStepInterfaceStatusService: FinishedStepInterfaceStatusService,
    private plannerService: PlannerService,
  ) {
    this.step$ = selectedIterationStepService.findSelectedObject().pipe(filter(step => !!step));
    this.planPropertiesMap$ = planpropertiesService.getMap();
    this.relaxationSpaces$ = planningTaskRelaxationService.getList();
    this.plannerBusy$ = plannerService.isPlannerBusy();
    this.iterfaceStati$ = finishedStepInterfaceStatusService.getList();


    combineLatest([this.step$, this.iterfaceStati$, this.planPropertiesMap$]).pipe(
      filter(([step, stati, planProperties]) => !!step && !!stati && !!planProperties),
      takeUntil(this.unsubscribe$)).
      subscribe(([step, stati, planProperties]) =>{
        let status: FinishedStepInterfaceStatus = stati.find(s => s._id == step._id);
        console.log("interface update");
        if(this.interfaceStatus == status){
          return;
        }
        this.interfaceStatus = status;
        if(status){
          this.selectedPP = status.question;
          this.questions$.next(planProperties.get(this.selectedPP));
          this.computedDependencies$.next(status.dependencies);
          this.selectedConflict$.next(status.conflict);
          this.viewpos = status.viewPos;
        }
        else {
          this.questions$.next(null);
          this.computedDependencies$.next(null);
          this.selectedConflict$.next(null);
          this.viewpos = 1;
        }
      });

    this.displayExplanations$ = this.step$.pipe(
      filter(step => !!step),
      map(step => step.relaxationExplanations && step.relaxationExplanations.length > 0)
    )
  }

  ngOnInit(): void {
  }

  selectQuestion(id : string): void {
    this.selectedPP = id
    combineLatest([this.step$, this.planPropertiesMap$]).
    pipe(take(1)).subscribe(
      ([step, planProperties]) => {
        if (step && planProperties) {
          // if (step.getDepExplanation(this.selectedPP)){
            let dependencies = getDependencies(step, this.selectedPP)
            console.log(dependencies);
            this.computedDependencies$.next(dependencies);
            this.questions$.next(planProperties.get(this.selectedPP));

            if (this.interfaceStatus){
              this.interfaceStatus = {_id: this.interfaceStatus._id, tab: this.interfaceStatus.tab, question: this.selectedPP, dependencies, conflict: null, viewPos: 0}
            }
            else {
              this.interfaceStatus = {_id: step._id, tab: 5, question: this.selectedPP, dependencies, conflict: null, viewPos: 0}
            }
            this.finishedStepInterfaceStatusService.saveObject(this.interfaceStatus);
          //   return
          // }
          // let exp = this.plannerService.computeMUGS(step, [this.selectedPP], Array.from(planProperties.values()));
          // this.selectedDepExp$.next(exp);
        }
      }
    );
  }


  selectConflict(conflict : PPConflict): void {
    this.viewpos = 2;
    console.log("selectConflict");
    console.log(conflict);
    this.selectedConflict$.next(conflict);
    this.interfaceStatus = {...this.interfaceStatus, conflict, viewPos: 2}
    this.finishedStepInterfaceStatusService.saveObject(this.interfaceStatus);
  }

  computeExplanations(): void {
    combineLatest([this.step$, this.relaxationSpaces$]).pipe(
      filter(([step, spaces]) => !!step), take(1)).subscribe(
        ([step, spaces]) => {
          if (spaces.length > 0){
            console.log("compute relaxation explanation");
            this.plannerService.computeRelaxExplanations(step);
          }
          else {
            console.log("compute MUGS")
            this.plannerService.computeMUGS(step);
          }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}


