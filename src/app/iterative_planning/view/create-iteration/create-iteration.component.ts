import { Component, ElementRef, TemplateRef, inject, viewChild } from "@angular/core";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Store } from "@ngrx/store";
import { EditableListModule } from "src/app/shared/components/editable-list/editable-list.module";

import { AsyncPipe, JsonPipe, NgFor } from "@angular/common";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { combineLatest, filter, map, startWith, take, tap } from "rxjs";
import { InfoModule } from "src/app/shared/components/info/info.module";
import { SideSheetModule } from "src/app/shared/components/side-sheet/side-sheet.module";
import { isNonEmptyValidator } from "src/app/validators/non-empty.validator";
import { PlanPropertyPanelComponent } from "../../../shared/components/plan-property-panel/plan-property-panel.component";
import { SelectPropertyComponent } from "../../components/select-property/select-property.component";
import { cancelNewIterationStep, createIterationStep, updateNewIterationStep } from "../../state/iterative-planning.actions";
import { selectIterativePlanningCreatedStepId, selectIterativePlanningIterationStepComputationRunning, selectIterativePlanningNumberOfSteps, selectIterativePlanningProperties } from "../../state/iterative-planning.selector";
import { selectPlanPropertyIds, selectPreselectedEnforcedGoals$, selectPreselectedSoftGoals$ } from "./create-iteration.component.selector";
import { concatLatestFrom } from "@ngrx/operators";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "app-create-iteration",
    imports: [
        AsyncPipe,
        EditableListModule,
        InfoModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        PlanPropertyPanelComponent,
        SelectPropertyComponent,
        ReactiveFormsModule,
        SideSheetModule,
    ],
    templateUrl: "./create-iteration.component.html",
    styleUrl: "./create-iteration.component.scss"
})
export class CreateIterationComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogService = inject(MatDialog);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute)

  handlePropertyIdSelection: (ids: string[]) => void;
  dialogRef: MatDialogRef<unknown> | undefined;

  propertySelector = viewChild.required<TemplateRef<ElementRef>>('propertySelector');

  computationRunning$ = this.store.select(selectIterativePlanningIterationStepComputationRunning);

  numberOfExistingSteps  = this.store.select(selectIterativePlanningNumberOfSteps);

  planProperties$ = this.store.select(selectIterativePlanningProperties);
  planPropertyIds$ = this.store.select(selectPlanPropertyIds);

  preselectedEnforcedGoals$ = this.store.select(selectPreselectedEnforcedGoals$);
  preselectedSoftGoals$ = this.store.select(selectPreselectedSoftGoals$);

  form = this.fb.group({
    general: this.fb.group({
      name: this.fb.control<string>("", Validators.required),
    }),
    enforcedGoalIds: this.fb.array<FormControl<string>>([], [isNonEmptyValidator]),
    softGoalIds: this.fb.array<FormControl<string>>([]),
  });

  enforcedPropertyIds$ = this.form.controls.enforcedGoalIds.valueChanges.pipe(
    startWith(this.form.controls.enforcedGoalIds.value),
    map(() => this.form.controls.enforcedGoalIds.value),
  );
  enforcedPlanProperties$ = combineLatest([
    this.planProperties$,
    this.enforcedPropertyIds$,
  ]).pipe(
    filter(([planProperties]) => !!planProperties),
    map(([planProperties, selectedPropertyIds]) => selectedPropertyIds?.map(id => planProperties?.[id]) ?? []),
  );
  hasEnforcedPlanProperties$ = this.enforcedPlanProperties$.pipe(map(properties => !!properties.length));

  softPlanPropertyIds$ = this.form.controls.softGoalIds.valueChanges.pipe(
    startWith(this.form.controls.softGoalIds.value),
    map(() => this.form.controls.softGoalIds.value),
  );
  softPlanProperties$ = combineLatest([
    this.planProperties$,
    this.softPlanPropertyIds$,
  ]).pipe(
    filter(([planProperties]) => !!planProperties),
    map(([planProperties, selectedPropertyIds]) => selectedPropertyIds?.map(id => planProperties?.[id]) ?? []),
  );
  hasSoftPlanProperties$ = this.softPlanProperties$.pipe(map(properties => !!properties.length));

  availableProperties$ = combineLatest([
    this.planProperties$.pipe(map(properties => Object.values(properties ?? {}))),
    this.enforcedPropertyIds$,
    this.softPlanPropertyIds$,
  ]).pipe(
    map(([allPlanProperties, enforcedPlanProperties, softPlanProperties]) => allPlanProperties?.filter(
      ({_id}) => !enforcedPlanProperties?.includes(_id) && !softPlanProperties?.includes(_id),
    )),
  );

  constructor() {
    this.preselectedSoftGoals$.pipe(takeUntilDestroyed()).subscribe(softGoals => {
      this.form.controls.softGoalIds.clear();
      this.addSoftGoalIds(softGoals);
    });
    this.preselectedEnforcedGoals$.pipe(takeUntilDestroyed()).subscribe(enforcedGoals => {
      this.form.controls.enforcedGoalIds.clear();
      this.addEnforcedGoalIds(enforcedGoals);
    });
    this.numberOfExistingSteps.pipe(takeUntilDestroyed()).subscribe(numSteps => {
      this.form.controls.general.controls.name.setValue('Step ' + (numSteps + 1));
    })
  }

  addEnforcedGoalIds(ids: string[]): void {
    const idControls = ids.map(id => this.fb.control<string>(id));

    idControls.forEach(control => this.form.controls.enforcedGoalIds.push(control));
  }

  addSoftGoalIds(ids: string[]): void {
    const idControls = ids.map(id => this.fb.control<string>(id));

    idControls.forEach(control => this.form.controls.softGoalIds.push(control));
  }

  removeEnforcedGoal(index: number): void {
    this.form.controls.enforcedGoalIds.removeAt(index);
    this.form.updateValueAndValidity();
  }

  removeSoftGoal(index: number): void {
    this.form.controls.softGoalIds.removeAt(index);
  }

  addPropertyEnforce(): void {
    this.handlePropertyIdSelection = (ids: string[]) => {
      this.addEnforcedGoalIds(ids);
      this.dialogRef?.close();
    }

    this.dialogRef = this.dialogService.open(this.propertySelector());
  }

  addPropertySoftGoal(): void {
    this.handlePropertyIdSelection = (ids: string[]) => {
      this.addSoftGoalIds(ids);
      this.dialogRef?.close();
    }

    this.dialogRef = this.dialogService.open(this.propertySelector());
  }

  onCancelPropertySelection(): void {
    this.dialogRef?.close();
  }

  onCancel(): void {
    this.store.dispatch(cancelNewIterationStep());
  }

  onSubmit(): void {
    this.store.dispatch(updateNewIterationStep({
      iterationStep: {
        name: this.form.controls.general.controls.name.value,
        hardGoals: this.form.controls.enforcedGoalIds.value,
        softGoals: this.form.controls.softGoalIds.value,
      },
    }));

    this.store.dispatch(createIterationStep())
  }
}

