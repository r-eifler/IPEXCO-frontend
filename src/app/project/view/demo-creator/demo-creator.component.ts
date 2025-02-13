import { AsyncPipe } from "@angular/common";
import { Component, ElementRef, inject, OnInit, TemplateRef, viewChild } from "@angular/core";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, filter, map, startWith, switchMap, take } from 'rxjs';
import { DialogModule } from "src/app/shared/components/dialog/dialog.module";
import { EditableListModule } from "src/app/shared/components/editable-list/editable-list.module";
import { PlanPropertyPanelComponent } from "src/app/shared/components/plan-property-panel/plan-property-panel.component";
import { PlanProperty, PlanPropertyBase } from "src/app/shared/domain/plan-property/plan-property";
import { isNonEmptyValidator } from "src/app/validators/non-empty.validator";
import { SelectPropertyComponent } from "../../components/select-property/select-property.component";
import { ProjectDemoService } from "../../service/demo.service";
import { registerDemoCreation } from '../../state/project.actions';
import { selectProject, selectProjectProperties } from '../../state/project.selector';
import { Demo, DemoBase, DemoRunStatus } from "src/app/shared/domain/demo";

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

  handlePropertySelection: ((planProperties: PlanProperty[]) => void) | undefined;
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
    image: this.fb.control<File | null>(null),
    properties: this.fb.array<FormControl<PlanProperty | null>>([], [isNonEmptyValidator])
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
      ({_id}) => !selectedProperties.filter(pp => pp !== null).map(pp => pp._id).includes(_id),
    )),
  );

  imageFile$ = new BehaviorSubject<any>(null);
  imageFileName$ = this.imageFile$.pipe(map(f => f?.name));
  imageSelected = false;
  imagePath$ = this.imageFile$.pipe(
    filter(f => !!f),
    switchMap(f => this.uploadService.postDemoImage$(f)),
    startWith(null)
  );
  imageUploaded$ = this.imagePath$.pipe(map(path => path !== null))


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

  globalHardGoal(index: number): void {
    const currProp = this.form.controls.properties.at(index).value
    if(currProp === null){
      return;
    }
    let newProp = {...currProp};
    newProp.globalHardGoal = !newProp.globalHardGoal;
    this.form.controls.properties.at(index).setValue(newProp);
  }

  ngOnInit(): void {}

  createDemo(): void {

    combineLatest([this.project$,this.imagePath$]).pipe(
      take(1)
    ).subscribe(
      ([project, imagePath]) => {
        if(project == undefined){
          return
        }
        const newDemo: DemoBase = {
          status: DemoRunStatus.pending,
          projectId: project._id,
          name: this.form.controls.main.controls.name.value ?? 'TODO',
          summaryImage: imagePath,
          description: this.form.controls.main.controls.description.value
            ? this.form.controls.main.controls.description.value
            : "TODO",
          instanceInfo: this.form.controls.taskInfo.controls.instanceInfo.value
            ? this.form.controls.taskInfo.controls.instanceInfo.value
            : "TODO",
          public: false,
          baseTask: project.baseTask,
          settings: project.settings,
          domain: project.domain,
        };

        const selectedPlanProperties : PlanPropertyBase[]  = this.form.controls.properties.controls.
          map(fc => fc.value).filter(pp => pp !== null);

        this.store.dispatch(registerDemoCreation({demo: newDemo, properties: selectedPlanProperties}))

        this.ownDialogRef?.close();
      }
    )
  }

  cancel(){
    if(this.ownDialogRef)
      this.ownDialogRef.close();
  }

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0)
      this.imageFile$.next(input.files[0]);
  }

  onCancelPropertySelection(): void {
    this.dialogRef?.close();
  }

}
