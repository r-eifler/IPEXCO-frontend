import { Component, ElementRef, inject, OnInit, TemplateRef, viewChild } from "@angular/core";
import { Demo, DemoRunStatus } from "src/app/project/domain/demo";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, startWith, Subject, switchMap, take, tap } from 'rxjs';
import { selectProject, selectProjectProperties } from '../../state/project.selector';
import { registerDemoCreation } from '../../state/project.actions';
import { isNonEmptyValidator } from "src/app/validators/non-empty.validator";
import { EditableListModule } from "src/app/shared/components/editable-list/editable-list.module";
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { DialogModule } from "src/app/shared/components/dialog/dialog.module";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { PlanPropertyPanelComponent } from "src/app/shared/components/plan-property-panel/plan-property-panel.component";
import { AsyncPipe } from "@angular/common";
import { SelectPropertyComponent } from "../../components/select-property/select-property.component";
import { PlanProperty } from "src/app/shared/domain/plan-property/plan-property";
import { ProjectDemoService } from "../../service/demo.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-demo-creator",
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
    styleUrls: ["./demo-creator.component.scss"]
})
export class DemoCreatorComponent implements OnInit {

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private uploadService = inject(ProjectDemoService);
  private dialogService = inject(MatDialog);

  propertySelector = viewChild.required<TemplateRef<ElementRef>>('propertySelector');

  handlePropertySelection: (planProperties: PlanProperty[]) => void;
  dialogRef: MatDialogRef<unknown> | undefined;

  ownDialogRef: MatDialogRef<unknown> | undefined = inject(MatDialogRef)

  project$ = this.store.select(selectProject)
  projectPlanProperties$ = this.store.select(selectProjectProperties)
  planProperties = new BehaviorSubject<PlanProperty[]>([]);

  form = this.fb.group({
    main: this.fb.group({
      name: this.fb.control<string>("", Validators.required),
      description: this.fb.control<string>(""),
    }),
    taskInfo: this.fb.group({
      domainInfo: this.fb.control<string>(""),
      instanceInfo: this.fb.control<string>(""),
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

  imageFile$ = new BehaviorSubject<any>(null);
  imageFileName$ = this.imageFile$.pipe(map(f => f?.name));
  imageSelected = false;
  imagePath$ = this.imageFile$.pipe(
    filter(f => !!f),
    switchMap(f => this.uploadService.postDemoImage$(f)),
    startWith(null)
    // catchError(() => console.log("ERROR"))
  );
  imageUploaded$ = this.imagePath$.pipe(map(path => path !== null))

  constructor(){
    this.imagePath$.pipe(takeUntilDestroyed(),tap(console.log)).subscribe();
  }


  addSelectedProperty(planProperties: PlanProperty[]): void {
    const idControls = planProperties.map(pp => this.fb.control<PlanProperty>(pp));

    idControls.forEach(control => this.form.controls.properties.push(control));
  }

  addProperty(): void {
    this.handlePropertySelection = (planProperties: PlanProperty[]) => {
      this.addSelectedProperty(planProperties);
      this.dialogRef?.close();
    }

    this.dialogRef = this.dialogService.open(this.propertySelector());
  }

  removeSelectedProperty(index: number): void {
    this.form.controls.properties.removeAt(index);
  }

  ngOnInit(): void {}

  createDemo(): void {

    combineLatest([this.project$,this.imagePath$]).pipe(
      tap(console.log),
      take(1)
    ).subscribe(
      ([project, imagePath]) => {
        console.log("Image path: " + imagePath);
        const newDemo: Demo = {
          status: DemoRunStatus.pending,
          projectId: project._id,
          name: this.form.controls.main.controls.name.value,
          summaryImage: imagePath,
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
          baseTask: project.baseTask,
          domainSpecification: project.domainSpecification,
          settings: project.settings
        };

        console.log("New Demo:");
        console.log(newDemo);

        const selectedPlanProperties  = this.form.controls.properties.controls.
          map(fc => {
            let pp = {...fc.value};
            pp._id = null;
            pp.project = null;
            return pp;
          });

        this.store.dispatch(registerDemoCreation({demo: newDemo, properties: selectedPlanProperties}))

        this.ownDialogRef?.close();
      }
    )
  }

  cancel(){
    this.ownDialogRef.close();
  }

  onFileChanged(event) {
    this.imageFile$.next(event.target.files[0]);
  }

  onCancelPropertySelection(): void {
    this.dialogRef?.close();
  }

}
