import { Component, ElementRef, inject, OnInit, TemplateRef, viewChild } from "@angular/core";
import { Demo } from "src/app/interface/demo";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, startWith, take, tap } from 'rxjs';
import { selectProject, selectProjectProperties } from '../../state/project.selector';
import { registerDemoCreation } from '../../state/project.actions';
import { isNonEmptyValidator } from "src/app/validators/non-empty.validator";
import { EditableListModule } from "src/app/shared/component/editable-list/editable-list.module";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { DialogModule } from "src/app/shared/component/dialog/dialog.module";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { PlanPropertyPanelComponent } from "src/app/shared/component/plan-property-panel/plan-property-panel.component";
import { AsyncPipe } from "@angular/common";
import { SelectPropertyComponent } from "../select-property/select-property.component";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";

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
    PlanPropertyPanelComponent,
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

  handlePropertySelection: (planProperties: PlanProperty[]) => void;
  dialogRef: MatDialogRef<unknown> | undefined;

  project$ = this.store.select(selectProject)
  projectPlanProperties$ = this.store.select(selectProjectProperties)
  planProperties = new BehaviorSubject<PlanProperty[]>([]);

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
    properties: this.fb.array<FormControl<PlanProperty>>([], [isNonEmptyValidator])
  });

  selectedPlanProperties$ = this.form.controls.properties.valueChanges.pipe(
    startWith(this.form.controls.properties.value),
    map(() => this.form.controls.properties.value),
  );
  hasSelectedPlanProperties$ = this.selectedPlanProperties$.pipe(map(properties => !!properties.length));

  availableProperties$ = combineLatest([
    this.projectPlanProperties$.pipe(map(properties => Object.values(properties ?? {}))),
    this.selectedPlanProperties$,
  ]).pipe(
    map(([projectPlanProperties, selectedProperties]) => projectPlanProperties?.filter(
      ({_id}) => !selectedProperties?.map(pp => pp._id).includes(_id),
    )),
  );

  imageFileName = "";
  imageFile;
  imageSelected = false;

  addSelectedProperty(planProperties: PlanProperty[]): void {
    const idControls = planProperties.map(pp => this.fb.control<PlanProperty>(pp));

    idControls.forEach(control => this.form.controls.properties.push(control));
  }

  addProperty(): void {
    this.handlePropertySelection = (planProperties: PlanProperty[]) => {
      console.log(planProperties)
      this.addSelectedProperty(planProperties);
      this.dialogRef?.close();
    }

    this.dialogRef = this.dialogService.open(this.propertySelector());
  }

  removeSelectedProperty(index: number): void {
    this.form.controls.properties.removeAt(index);
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
