import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest } from "rxjs";
import { filter, map, shareReplay, startWith, take, tap } from "rxjs/operators";
import { TemplateFileUploadComponent } from "src/app/components/files/file-upload/file-upload.component";
import { Encoding } from "src/app/global_specification/domain/services";
import { defaultGeneralSetting } from "src/app/project/domain/general-settings";
import { DialogModule } from "src/app/shared/components/dialog/dialog.module";
import { SpecCardFeatureComponent } from "src/app/shared/components/spec-card/spec-card-feature/spec-card-feature.component";
import { ProjectBase } from "src/app/shared/domain/project";


@Component({
    selector: "app-project-creator",
    imports: [
        DialogModule,
        AsyncPipe,
        MatIconModule,
        TemplateFileUploadComponent,
        MatStepperModule,
        MatLabel,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        AsyncPipe,
        SpecCardFeatureComponent
    ],
    templateUrl: "./creator.component.html",
    styleUrls: ["./creator.component.scss"]
})
export class ProjectCreatorComponent {

  store = inject(Store);
  dialogRef = inject(MatDialogRef<ProjectCreatorComponent>);
  
  selectedIndex = 0;
  maxStepIndex = 1

  encoding = Encoding;
  
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: this.fb.control<string | null>(null, Validators.required),
    domain: this.fb.control<string | null>(null, Validators.required),
    description: this.fb.control<string | null>(null),
  });

  domainDependentModel$ = new BehaviorSubject<string | null>(null);
  domainDependentModelValid$ = this.domainDependentModel$.pipe(
    filter(m => m !== null),
    map(m => {
      try{
        JSON.parse(m);
        return true;
      }
      catch(err) {
        return false;
      }
    })
  )

  model$ = this.domainDependentModel$.pipe(
    map((domainDependentModel) => {
      return domainDependentModel ? JSON.parse(domainDependentModel) as unknown : null;
    }),
    shareReplay(1),
  )


  objects$ = this.domainDependentModel$.pipe(
    map((domainDependentModel) => {
      return [];
    }),
    shareReplay(1),
  )

  modelValid$ = this.domainDependentModel$.pipe(
    map((domainDependentModel) => {
      if(domainDependentModel == null){
        return false;
      }
      try{
        JSON.parse(domainDependentModel);
        return true;
      }
      catch(err) {
        return false;
      }
    }),
    startWith(false),
    shareReplay(1),
  )

  onTaskSelected(model: string){
    this.domainDependentModel$.next(model);
  }

  onNext() {
    if(this.selectedIndex < this.maxStepIndex){
      this.selectedIndex += 1;
    }
  }

  onPrevious() {
    if(this.selectedIndex > 0){
      this.selectedIndex -= 1;
    }
  }

  onCancel(){
    this.dialogRef.close();
  }

  onSave(): void {
    console.log("onSave");
    combineLatest([this.model$, this.objects$]).pipe(
      tap(console.log),
      take(1),
    ).subscribe(
      ([model,objects]) => {

        const newProject: ProjectBase = {
          name: this.form.controls.name.value ?? 'TODO',
          domain: this.form.controls.domain.value ?? 'TODO',
          description: this.form.controls.description.value ? this.form.controls.description.value : "TODO",
          settings: defaultGeneralSetting,
          baseTask: {
            name: this.form.controls.name.value ?? 'TODO',
            objects,
            model,
          },
          public: false,
          instanceInfo: null,
          summaryImage: null
        };

        console.log("create new project");
        console.log(newProject);
        // this.store.dispatch(createProject({project: newProject}))

        this.dialogRef.close();
      }
    )
  }
}
