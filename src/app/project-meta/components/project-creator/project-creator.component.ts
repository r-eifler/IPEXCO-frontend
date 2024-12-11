import { defaultGeneralSetting } from "../../../project/domain/general-settings";
import { Component, inject, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { AuthenticationService } from "../../../user/services/authentication.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { defaultDomainSpecification, DomainSpecification } from "src/app/shared/domain/domain-specification";
import { PDDLService } from "src/app/project-meta/service/pddl.service";
import { take, tap, map} from "rxjs/operators";
import { PlanningDomain, PlanningModel, PlanningProblem } from "src/app/shared/domain/planning-task";
import { Store } from "@ngrx/store";
import { createProject } from "../../state/project-meta.actions";
import { AsyncPipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { TemplateFileUploadComponent } from "src/app/components/files/file-upload/file-upload.component";
import { MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { selectUser } from "src/app/user/state/user.selector";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { Project } from "src/app/shared/domain/project";
import { ExampleProject } from "../../example-projects";
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
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
    useExample: [false],
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

  exampleProjects: ExampleProject[] = [
    {
      name: "Blocksworld",
      domainName: "blocksworld",
      description: "Classic blocks world planning problem, small instance",
      domainFile: "./assets/example-projects/blocksworld/domain.pddl",
      problemFile: "./assets/example-projects/blocksworld/problem.pddl",
      templateFile: "./assets/example-projects/blocksworld/templates.json",
      promptFile: "./assets/example-projects/blocksworld/prompt.json",
    },
  ];

  selectedExample: ExampleProject | null = null;

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

  onExampleSelected(example: ExampleProject | null) {
    this.selectedExample = example;
    if (example) {
      this.projectBasic.patchValue({
        name: example.name,
        domain_name: example.domainName,
        description: example.description
      });

      // Automatically load example files without requiring user selection
      this.loadExampleFiles(example);
    } else {
      // Clear form when no example is selected
      this.projectBasic.reset();
      this.selectedDomain = null;
      this.selectedProblem = null;
    }
  }

  private loadExampleFiles(example: ExampleProject) {
    fetch(example.domainFile)
      .then(response => response.text())
      .then(domain => this.onDomainSelected(domain));
    
    fetch(example.problemFile)
      .then(response => response.text())
      .then(problem => this.onProblemSelected(problem));
  }

  onSave(): void {

    combineLatest([
      this.translatedModel$,
      this.store.select(selectUser)
    ]).pipe(
      take(1),
    ).subscribe(
      ([model, user]) => {

        console.log("Save new project")

        const newProject: Project = {
          _id: this.editedProject ? this.editedProject._id : null,
          updated: new Date().toLocaleString(),
          name: this.projectBasic.controls.name.value,
          user: user._id,
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
