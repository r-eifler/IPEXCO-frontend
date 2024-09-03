import { defaultGeneralSetting } from "../../../interface/settings/general-settings";
import { Project } from "./../../../interface/project";
import { Component, inject, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import {
  PDDLFile,
} from "../../../interface/files/files";
import { ProjectsService } from "src/app/service/project/project-services";
import { AuthenticationService } from "../../../service/authentication/authentication.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { defaultDomainSpecification, DomainSpecification } from "src/app/interface/files/domain-specification";

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
    description: ['', Validators.required],
  });

  selectedDomain: any 
  selectedProblem: any 
  selectedSpecification: any 

  projects$: Observable<Project[]>;

  editedProject: Project;
  disableSelect = false;

  constructor(
    private projectService: ProjectsService,
    private userService: AuthenticationService,
    public dialogRef: MatDialogRef<ProjectCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {

    this.projects$ = this.projectService.getList();

    this.editedProject = data.project;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onDomainSelected(domain: string){
    this.selectedDomain = domain
    // console.log(this.selectedDomain)
  }

  onProblemSelected(problem: string){
    this.selectedProblem = problem
    // console.log(this.selectedDomain)
  }

  onSpecificationSelected(specification: string){
    this.selectedSpecification = specification
    // console.log(this.selectedDomain)
  }

  onSave(): void {
    // console.log('Save project');
    const newProject: Project = {
      _id: this.editedProject ? this.editedProject._id : null,
      updated: new Date().toLocaleString(),
      name: this.projectBasic.controls.name.value,
      user: this.userService.getUser()._id,
      description: this.projectBasic.controls.description.value,
      domainSpecification: defaultDomainSpecification,
      settings: defaultGeneralSetting,
      baseTask: null,
      public: false,
    };

    this.projectService.saveObject(newProject);

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }
}
