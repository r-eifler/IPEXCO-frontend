import { defaultGeneralSetting } from "../../../interface/settings/general-settings";
import { Component, inject, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import {
  PDDLFile,
} from "../../../interface/files/files";
import { ProjectsService } from "src/app/service/project/project-services";
import { AuthenticationService } from "../../../service/authentication/authentication.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { defaultDomainSpecification, DomainSpecification } from "src/app/interface/files/domain-specification";
import { PDDLService } from "src/app/service/pddl/pddl.service";
import { take, tap, map} from "rxjs/operators";
import { PlanningDomain, PlanningProblem } from "src/app/interface/planning-task";
import { Project } from "../../domain/project";

@Component({
  selector: "app-project-creator",
  templateUrl: "./project-creator.component.html",
  styleUrls: ["./project-creator.component.scss"],
})
export class ProjectCreatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

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

  constructor(
    private projectService: ProjectsService,
    private userService: AuthenticationService,
    private pddlService: PDDLService,
    public dialogRef: MatDialogRef<ProjectCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {

    this.projects$ = this.projectService.getList();
    this.editedProject = data.project;

    this.translatedDomain$ = this.pddlService.getDomain();
    this.translatedProblem$ = this.pddlService.getProblem()
  }

  ngOnInit(): void {

    this.domainValid$ = this.translatedDomain$.pipe(
      map(d => !!this.selectedDomain && !!d)
    )

    this.problemValid$ = this.translatedProblem$.pipe(
      map(p => !!this.selectedProblem && !!p)
    )
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onDomainSelected(domain: string){
    this.selectedDomain = domain
    this.pddlService.translateDomain(this.selectedDomain)
    // console.log(this.selectedDomain)
  }

  onProblemSelected(problem: string){
    this.selectedProblem = problem
    this.pddlService.translateProblem(this.selectedProblem)
    // console.log(this.selectedDomain)
  }

  onSpecificationSelected(specification: string){
    this.selectedSpecification = specification
    // console.log(this.selectedDomain)
  }

  onSave(): void {
    // console.log('Save project');
    combineLatest([this.translatedDomain$, this.translatedProblem$]).pipe(
      // take(1),
    ).subscribe(
      ([domain, problem]) => {

        console.log("Save new project")

        const newProject: Project = {
          projectId: this.editedProject ? this.editedProject.projectId : null,
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
            model: {...domain,...problem}
          },
          public: false,
        };
    
        this.projectService.saveObject(newProject);
    
        this.dialogRef.close();
      }
    )
  }

  onBack(): void {
    this.dialogRef.close();
  }
}
