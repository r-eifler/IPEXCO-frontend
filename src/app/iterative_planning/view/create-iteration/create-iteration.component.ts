import { Component, ElementRef, TemplateRef, inject, viewChild } from "@angular/core";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Store } from "@ngrx/store";
import { EditableListModule } from "src/app/shared/component/editable-list/editable-list.module";

import { AsyncPipe, JsonPipe, NgFor } from "@angular/common";
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { combineLatest, filter, map, startWith } from "rxjs";
import { InfoModule } from "src/app/shared/component/info/info.module";
import { SideSheetModule } from "src/app/shared/component/side-sheet/side-sheet.module";
import { isNonEmptyValidator } from "src/app/validators/non-empty.validator";
import { PlanProeprtyPanelComponent } from "../../components/plan-proeprty-panel/plan-proeprty-panel.component";
import { SelectPropertyComponent } from "../../components/select-property/select-property.component";
import { selectIterativePlanningProperties } from "../../state/iterative-planning.selector";
import { selectPlanPropertyIds } from "./create-iteration.component.selector";

@Component({
  selector: "app-create-iteration",
  standalone: true,
  imports: [
    AsyncPipe,
    EditableListModule,
    InfoModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgFor,
    PlanProeprtyPanelComponent,
    SelectPropertyComponent,
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
  private dialogService = inject(MatDialog);

  handlePropertyIdSelection: (ids: string[]) => void;
  dialogRef: MatDialogRef<unknown> | undefined;

  propertySelector = viewChild.required<TemplateRef<ElementRef>>('propertySelector');

  planProperties$ = this.store.select(selectIterativePlanningProperties);
  planPropertyIds$ = this.store.select(selectPlanPropertyIds);

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

  onSubmit(): void {

  }
}

