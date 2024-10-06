import { Component, inject } from "@angular/core";
import { FormBuilder, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Store } from "@ngrx/store";
import { EditableListModule } from "src/app/shared/component/editable-list/editable-list.module";

import { AsyncPipe, JsonPipe, NgFor } from "@angular/common";
import { combineLatest, filter, map, startWith } from "rxjs";
import { InfoModule } from "src/app/shared/component/info/info.module";
import { SideSheetModule } from "src/app/shared/component/side-sheet/side-sheet.module";
import { PlanProeprtyPanelComponent } from "../../components/plan-proeprty-panel/plan-proeprty-panel.component";
import { selectIterativePlanningProperties } from "../../state/iterative-planning.selector";
import { selectPlanPropertyIds } from "./create-iteration.component.selector";

const isNonEmptyValidator: ValidatorFn = (control) => (control?.value?.length > 0) ? null : { empty: true};

@Component({
  selector: "app-create-iteration",
  standalone: true,
  imports: [
    AsyncPipe,
    EditableListModule,
    InfoModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgFor,
    PlanProeprtyPanelComponent,
    ReactiveFormsModule,
    SideSheetModule,
    JsonPipe,
  ],
  templateUrl: "./create-iteration.component.html",
  styleUrl: "./create-iteration.component.scss",
})
export class CreateIterationComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  planProperties$ = this.store.select(selectIterativePlanningProperties);
  planPropertyIds$ = this.store.select(selectPlanPropertyIds);

  form = this.fb.group({
    general: this.fb.group({
      name: this.fb.control<string>("", Validators.required),
    }),
    enforcedGoalIds: this.fb.array<FormControl<string>>([], [isNonEmptyValidator]),
    softGoalIds: this.fb.array<FormControl<string>>([]),
  });

  enforcedPlanProperties$ = combineLatest([
    this.planProperties$,
    this.form.controls.enforcedGoalIds.valueChanges.pipe(
      startWith(this.form.controls.enforcedGoalIds.value),
      map(() => this.form.controls.enforcedGoalIds.value),
    ),
  ]).pipe(
    filter(([planProperties]) => !!planProperties),
    map(([planProperties, selectedPropertyIds]) => selectedPropertyIds?.map(id => planProperties?.[id]) ?? []),
  );
  hasEnforcedPlanProperties$ = this.enforcedPlanProperties$.pipe(map(properties => !!properties.length));

  softPlanProperties$ = combineLatest([
    this.planProperties$,
    this.form.controls.softGoalIds.valueChanges.pipe(
      startWith(this.form.controls.softGoalIds.value),
      map(() => this.form.controls.softGoalIds.value),
    ),
  ]).pipe(
    filter(([planProperties]) => !!planProperties),
    map(([planProperties, selectedPropertyIds]) => selectedPropertyIds?.map(id => planProperties?.[id]) ?? []),
  );
  hasSoftPlanProperties$ = this.softPlanProperties$.pipe(map(properties => !!properties.length));


  addEnforcedGoalIds(ids: string[]): void {
    const idControls = ids.map(id => this.fb.control<string>(id));

    idControls.forEach(control => this.form.controls.enforcedGoalIds.push(control));
  }

  removeEnforcedGoal(index: number): void {
    this.form.controls.enforcedGoalIds.removeAt(index);
    this.form.updateValueAndValidity();
  }

  removeSoftGoal(index: number): void {
    this.form.controls.softGoalIds.removeAt(index);
  }

  onSubmit(): void {

  }
}

