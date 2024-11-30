import { defaultGeneralSetting } from "../../../project/domain/general-settings";
import { Component, inject, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { AuthenticationService } from "../../../service/authentication/authentication.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { defaultDomainSpecification, DomainSpecification } from "src/app/interface/files/domain-specification";
import { PDDLService } from "src/app/service/pddl/pddl.service";
import { take, tap, map} from "rxjs/operators";
import { PlanningDomain, PlanningModel, PlanningProblem } from "src/app/interface/planning-task";
import { Project } from "../../../project/domain/project";
import { Store } from "@ngrx/store";
import { createProject } from "../../state/project-meta.actions";
import { AsyncPipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { TemplateFileUploadComponent } from "src/app/components/files/file-upload/file-upload.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-project-creator",
  standalone: true,
  imports: [
    AsyncPipe,
    MatIconModule,
    TemplateFileUploadComponent,
    MatStepperModule,
    MatLabel,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: "./project-creator.component.html",
  styleUrls: ["./project-creator.component.scss"],
})
export class ProjectCreatorComponent implements OnInit {

  private formBuilder = inject(FormBuilder);

  projectBasic = this.formBuilder.group({
    name: ['', Validators.required],
    domain_name: ['', Validators.required],
    description: ['', Validators.required],
  });

  selectedDomain: any
  selectedProblem: any
  selectedSpecification: any

  projects$: Observable<Project[]>;

  editedProject: Project;
  disableSelect = false;

  translatedDomain$: BehaviorSubject<PlanningDomain>;
  domainValid$: Observable<boolean>;

  translatedProblem$: BehaviorSubject<PlanningProblem>;
  problemValid$: Observable<boolean>;

  translatedModel$: BehaviorSubject<PlanningModel>;
  modelValid$: Observable<boolean>;

  constructor(
    private store: Store,
    private userService: AuthenticationService,
    private pddlService: PDDLService,
    public dialogRef: MatDialogRef<ProjectCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {

    this.editedProject = data.project;

    this.translatedDomain$ = this.pddlService.getDomain();
    this.translatedProblem$ = this.pddlService.getProblem()
    this.translatedModel$ = this.pddlService.getModel()
  }

  ngOnInit(): void {

    this.domainValid$ = this.translatedDomain$.pipe(
      map(d => !!this.selectedDomain && !!d)
    )

    this.problemValid$ = this.translatedProblem$.pipe(
      map(p => !!this.selectedProblem && !!p)
    )

    this.modelValid$ = this.translatedModel$.pipe(
      map(m => !!this.selectedProblem && !!this.selectedDomain && !!m)
    )
  }


  onDomainSelected(domain: string){
    this.selectedDomain = domain
    if(!!this.selectedDomain && !!this.selectedProblem)
      this.pddlService.translateModel(this.selectedDomain, this.selectedProblem)
    // console.log(this.selectedDomain)
  }

  onProblemSelected(problem: string){
    this.selectedProblem = problem
    if(!!this.selectedDomain && !!this.selectedProblem)
      this.pddlService.translateModel(this.selectedDomain, this.selectedProblem)
    // console.log(this.selectedDomain)
  }

  onSpecificationSelected(specification: string){
    this.selectedSpecification = specification
    // console.log(this.selectedDomain)
  }

  onSave(): void {
    // console.log('Save project');
   this.translatedModel$.pipe(
      // take(1),
    ).subscribe(
      (model) => {

        console.log("Save new project")

        const newProject: Project = {
          _id: this.editedProject ? this.editedProject._id : null,
          updated: new Date().toLocaleString(),
          name: this.projectBasic.controls.name.value,
          user: this.userService.getUser()._id,
          description: this.projectBasic.controls.description.value,
          domainSpecification: defaultDomainSpecification,
          settings: defaultGeneralSetting,
          baseTask: {
            name: this.projectBasic.controls.name.value,
            domain_name: this.projectBasic.controls.domain_name.value,
            encoding: "classic",
            model: model
          },
          public: false,
        };

        this.store.dispatch(createProject({project: newProject}))

        this.dialogRef.close();
      }
    )
  }
}
