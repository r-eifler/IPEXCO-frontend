import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { BreadcrumbModule } from 'src/app/shared/components/breadcrumb/breadcrumb.module';
import { EmptyStateModule } from 'src/app/shared/components/empty-state/empty-state.module';
import { PageModule } from 'src/app/shared/components/page/page.module';
import { BelugaPlanAnimationComponent } from '../../components/beluga-plan-animation/beluga-plan-animation.component';
import { PlanInspectionComponent } from '../../components/plan-inspection/plan-inspection.component';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { selectDomainSpecification } from 'src/app/iterative_planning/state/iterative-planning.feature';
import { selectComparisonPlan, selectProject, selectReferencePlan, selectSelectedPlan } from 'src/app/planning/state/planning.selector';
import { BelugaActionZ } from '../../domain/beluga_plan';
import { array } from 'zod';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BelugaProblemZ } from '../../domain/beluga_problem';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    BelugaPlanAnimationComponent,
    PlanInspectionComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatCheckboxModule
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

  selectedJigs$ = this.form.controls.jigs.valueChanges;
  selectedFlight$ = this.form.controls.flight.valueChanges;
  hideCommonPrefix$ = this.form.controls.hideCommonPrefix.valueChanges;

  project$ = this.store.select(selectProject);
  domainSpecification$ = this.store.select(selectDomainSpecification);

  model$ = this.project$.pipe(
    map(p => {
      const model = p?.baseTask?.model;
      if(model !== null && model !== undefined){
        return BelugaProblemZ.parse(model);
        }
      return null;
  }));

  jigs$ = this.model$.pipe(map(m => m !== null ? Object.values(m.jigs) : []))
  flights$ = this.model$.pipe(map(m => m !== null ? Object.values(m.flights) : []))

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
        if(i < compActions.length - 1 &&  JSON.stringify(refActions[i]) === JSON.stringify(compActions[i])){
          prefix = i + 1
        }
        else{
          // console.log(refActions[i]);
          // console.log(compActions[i]);
          // console.log(JSON.stringify(refActions[i]) === JSON.stringify(compActions[i]));
          break;
        }
      }
      return prefix;
    })
  );
}
