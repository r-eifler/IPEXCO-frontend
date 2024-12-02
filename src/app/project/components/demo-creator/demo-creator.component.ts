import { Component, ElementRef, inject, Inject, OnInit, TemplateRef, viewChild } from "@angular/core";
import { Demo } from "src/app/interface/demo";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, startWith, take, tap } from 'rxjs';
import { Project } from '../../domain/project';
import { selectProject } from '../../state/project.selector';
import { PlanProperty } from 'src/app/iterative_planning/domain/plan-property/plan-property';
import { registerDemoCreation } from '../../state/project.actions';
import { selectPlanPropertyIds } from "src/app/iterative_planning/view/create-iteration/create-iteration.component.selector";
import { selectIterativePlanningProperties } from "src/app/iterative_planning/state/iterative-planning.selector";
import { isNonEmptyValidator } from "src/app/validators/non-empty.validator";
import { EditableListModule } from "src/app/shared/component/editable-list/editable-list.module";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { DialogModule } from "src/app/shared/component/dialog/dialog.module";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { PlanProeprtyPanelComponent } from "src/app/iterative_planning/components/plan-proeprty-panel/plan-proeprty-panel.component";
import { AsyncPipe } from "@angular/common";
import { SelectPropertyComponent } from "src/app/iterative_planning/components/select-property/select-property.component";

@Component({
  selector: "app-demo-creator",
  standalone: true,
  imports: [
    AsyncPipe,
    MatStepperModule,
    MatButtonModule,
    EditableListModule,
    DialogModule,
    MatIcon,
    ReactiveFormsModule,
    MatInputModule,
    PlanProeprtyPanelComponent,
    SelectPropertyComponent
  ],
  templateUrl: "./demo-creator.component.html",
  styleUrls: ["./demo-creator.component.scss"],
})
export class DemoCreatorComponent implements OnInit {

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogService = inject(MatDialog);

  propertySelector = viewChild.required<TemplateRef<ElementRef>>('propertySelector');

  handlePropertyIdSelection: (ids: string[]) => void;
  dialogRef: MatDialogRef<unknown> | undefined;

  project$ = this.store.select(selectProject)
  planProperties$ = this.store.select(selectIterativePlanningProperties)

  form = this.fb.group({
    main: this.fb.group({
      name: this.fb.control<string>("", Validators.required),
      description: this.fb.control<string>("", Validators.required),
    }),
    taskInfo: this.fb.group({
      domainInfo: this.fb.control<string>("", Validators.required),
      instanceInfo: this.fb.control<string>("", Validators.required),
    }),
    image: this.fb.control<File>(null),
    propertyIds: this.fb.array<FormControl<string>>([], [isNonEmptyValidator])
  });

  selectedPlanPropertyIds$ = this.form.controls.propertyIds.valueChanges.pipe(
    startWith(this.form.controls.propertyIds.value),
    map(() => this.form.controls.propertyIds.value),
  );
  selectedPlanProperties$ = combineLatest([
    this.planProperties$,
    this.selectedPlanPropertyIds$,
  ]).pipe(
    filter(([planProperties]) => !!planProperties),
    map(([planProperties, selectedPropertyIds]) => selectedPropertyIds?.map(id => planProperties?.[id]) ?? []),
  );
  hasSelectedPlanProperties$ = this.selectedPlanPropertyIds$.pipe(map(properties => !!properties.length));

  availableProperties$ = combineLatest([
    this.planProperties$.pipe(map(properties => Object.values(properties ?? {}))),
    this.selectedPlanPropertyIds$,
  ]).pipe(
    map(([allPlanProperties, selectedProperties]) => allPlanProperties?.filter(
      ({_id}) => !selectedProperties?.includes(_id),
    )),
  );

  imageFileName = "";
  imageFile;
  imageSelected = false;

  constructor(
  ) {
    this.planProperties$.pipe(
      tap(console.log)
    ).subscribe()
    this.availableProperties$.pipe(
      tap(console.log)
    ).subscribe()
  }

  addSelectedPropertyIds(ids: string[]): void {
    const idControls = ids.map(id => this.fb.control<string>(id));

    idControls.forEach(control => this.form.controls.propertyIds.push(control));
  }

  addProperty(): void {
    this.handlePropertyIdSelection = (ids: string[]) => {
      this.addSelectedPropertyIds(ids);
      this.dialogRef?.close();
    }

    this.dialogRef = this.dialogService.open(this.propertySelector());
  }

  removeSelectedProperty(index: number): void {
    this.form.controls.propertyIds.removeAt(index);
  }

  ngOnInit(): void {}

  createOrUpdateDemo(): void {

    this.project$.pipe(take(1)).subscribe(
      project => {
        const newDemo: Demo = {
          projectId: project._id,
          name: this.form.controls.main.controls.name.value,
          summaryImage: this.imageFile,
          description: this.form.controls.main.controls.description.value
            ? this.form.controls.main.controls.description.value
            : "TODO",
          domainInfo: this.form.controls.taskInfo.controls.domainInfo.value
            ? this.form.controls.taskInfo.controls.domainInfo.value
            : "TODO",
          instanceInfo: this.form.controls.taskInfo.controls.instanceInfo.value
            ? this.form.controls.taskInfo.controls.instanceInfo.value
            : "TODO",
          public: false,
          completion:  0.0,
          domainSpecification: project.domainSpecification,
          settings: project.settings
        };

        this.store.dispatch(registerDemoCreation({demo: newDemo}))

        this.dialogRef?.close();
      }
    )
  }

  onFileChanged(event) {
    this.imageFile = event.target.files[0];
    this.imageFileName = this.imageFile.name;
  }

  onCancelPropertySelection(): void {
    this.dialogRef?.close();
  }

}
