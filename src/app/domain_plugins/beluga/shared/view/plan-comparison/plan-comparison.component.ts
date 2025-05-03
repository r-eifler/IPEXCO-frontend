import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { equals } from 'ramda';
import { BehaviorSubject, combineLatest, map, startWith, take } from 'rxjs';
import { selectDomainSpecification } from 'src/app/iterative_planning/state/iterative-planning.feature';
import { selectComparisonPlan, selectProject, selectReferencePlan } from 'src/app/planning/state/planning.selector';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { EmptyStateModule } from 'src/app/shared/components/empty-state/empty-state.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { array } from 'zod';
import { PlanInspectionComponent } from '../../components/plan-inspection/plan-inspection.component';
import { StateCardComponent } from '../../components/state-card/state-card.component';
import { StepControlComponent } from '../../components/step-control/step-control.component';
import { BelugaActionZ } from '../../domain/beluga_plan';
import { BelugaProblemZ } from '../../domain/beluga_problem';
import { applyActions, getInitialState } from '../../domain/beluga_state';


@Component({
  selector: 'app-plan-comparison',
  imports: [
    AsyncPipe,
    BreadcrumbModule,
    EmptyStateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PageModule,
    RouterLink,
    PlanInspectionComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatCheckboxModule,
    StateCardComponent,
    StepControlComponent,
  ],
  templateUrl: './plan-comparison.component.html',
  styleUrl: './plan-comparison.component.scss'
})
export class PlanComparisonComponent {

  store = inject(Store);

  fb = inject(FormBuilder);

  form  = this.fb.group({
    flight: this.fb.control<string | null>(null),
    jigs: this.fb.control<string[]>([], {nonNullable: true}),
    hideCommonPrefix: this.fb.control<boolean>(false, {nonNullable: true}),
  })

  selectedJigs$ = this.form.controls.jigs.valueChanges.pipe(startWith([]));
  selectedFlight$ = this.form.controls.flight.valueChanges.pipe(startWith(null));
  hideCommonPrefix$ = this.form.controls.hideCommonPrefix.valueChanges;

  allowStepper$ = combineLatest([this.selectedJigs$, this.selectedFlight$]).pipe(
    map(([selectedJigs, selectedFlight]) => {
      return selectedJigs.length == 0 && selectedFlight == null
    })
  );

  selectedActionIndexRef$ = new BehaviorSubject<number|null>(null);
  selectedActionIndexComp$ = new BehaviorSubject<number|null>(null);

  project$ = this.store.select(selectProject);
  domainSpecification$ = this.store.select(selectDomainSpecification);

  task$ = this.project$.pipe(
    map(p => {
      const model = p?.baseTask?.model;
      if(model !== null && model !== undefined){
        return BelugaProblemZ.parse(model);
        }
      return null;
  }));

  jigs$ = this.task$.pipe(map(m => m !== null ? Object.values(m.jigs) : []))
  flights$ = this.task$.pipe(map(m => m !== null ? Object.values(m.flights) : []))

  initialState$ = this.task$.pipe(
    map(model => model === null ? null : getInitialState(model))
  );

  referencePlan$ = this.store.select(selectReferencePlan)
  referenceActions$ = this.referencePlan$.pipe(
    map(plan => {
      if(plan !== null && plan !== undefined && plan.actions !== undefined && plan.actions !== null ){
      return array(BelugaActionZ).parse(plan.actions);
      }
      return null;
    })
  );

  comparisonPlan$ = this.store.select(selectComparisonPlan);
  comparisonActions$ = this.comparisonPlan$.pipe(
    map(plan => {
      if(plan !== null && plan !== undefined && plan.actions !== undefined && plan.actions !== null ){
      return array(BelugaActionZ).parse(plan.actions);
      }
      return null;
    })
  );

  commonPrefixLength$ = combineLatest(([this.referenceActions$, this.comparisonActions$, this.hideCommonPrefix$])).pipe(
    map(([refActions, compActions, hide]) => {
      if(refActions === null || compActions === null || ! hide){
        return 0;
      }
      let prefix = 0;
      for(let i = 0; i < refActions.length; i++){
        if(i < compActions.length - 1 && equals(refActions[i], compActions[i])){
          console.log(i)
          prefix = i + 1
        }
        else{
          break;
        }
      }
      return prefix;
    })
  );

  selectedStateRef$ = combineLatest([this.initialState$, this.referenceActions$, this.selectedActionIndexRef$, this.task$]).pipe(
    map(([init, refActions, index, model]) => {

      if(init === null || refActions === null || index === null || model == null){
        return;
      }
      const actions = refActions?.slice(0,index+1)
      return applyActions(init, actions, model);
    })
  );

  selectedStateComp$ = combineLatest([this.initialState$, this.comparisonActions$, this.selectedActionIndexComp$, this.task$]).pipe(
    map(([init, compActions, index, model]) => {

      if(init === null || compActions === null || index === null || model == null){
        return;
      }
      const actions = compActions?.slice(0,index+1)
      return applyActions(init, actions, model);
    })
  );

  onActionSelected(ref: boolean, index: number){

    console.log(index);
    if(ref){
      this.selectedActionIndexRef$.next(index);
    }
    else{
      this.selectedActionIndexComp$.next(index);
    }
  }

  onForward(){
    this.referenceActions$.pipe(
      take(1)
    ).subscribe((actions) => 
      this.selectedActionIndexRef$.next( this.selectedActionIndexRef$.value === null ? 
			0 : Math.min(this.selectedActionIndexRef$.value + 1, actions?.length ?? 0))
    )

    this.comparisonActions$.pipe(
		take(1)
	  ).subscribe((actions) => 
		this.selectedActionIndexComp$.next( this.selectedActionIndexComp$.value === null ? 
			  0 : Math.min(this.selectedActionIndexComp$.value + 1, actions?.length ?? 0))
	  )
  }

  onBack(){
    this.selectedActionIndexRef$.next( this.selectedActionIndexRef$.value === null ? 
        0 : Math.max(this.selectedActionIndexRef$.value - 1, -1))

    this.selectedActionIndexComp$.next( this.selectedActionIndexComp$.value === null ? 
      0 : Math.max(this.selectedActionIndexComp$.value - 1, -1))
  }

}
