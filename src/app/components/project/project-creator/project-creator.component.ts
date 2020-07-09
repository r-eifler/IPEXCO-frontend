import {Project} from './../../../interface/project';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {DomainSpecificationFile, PDDLFile} from '../../../interface/files/files';
import {DomainFilesService, DomainSpecificationFilesService, ProblemFilesService} from '../../../service/files/pddl-file-services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectsService} from 'src/app/service/project/project-services';
import {AuthenticationService} from '../../../service/authentication/authentication.service';

@Component({
  selector: 'app-project-creator',
  templateUrl: './project-creator.component.html',
  styleUrls: ['./project-creator.component.css']
})
export class ProjectCreatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  // form fields
  projectForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
  });

  domainFiles$: Observable<PDDLFile[]>;
  problemFiles: Observable<PDDLFile[]>;
  domainSpecFiles: Observable<PDDLFile[]>;

  selectedDomain: PDDLFile;
  selectedProblem: PDDLFile;
  selectedDomainSpec: DomainSpecificationFile;

  projects$: Observable<Project[]>;

  editedProject: Project;
  disableSelect = false;


  constructor(
    private domainFilesService: DomainFilesService,
    private problemFilesService: ProblemFilesService,
    private domainSpecFilesService: DomainSpecificationFilesService,
    private projectService: ProjectsService,
    private userService: AuthenticationService,
    public dialogRef: MatDialogRef<ProjectCreatorComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.domainFiles$ = this.domainFilesService.files$;
    this.domainFilesService.findFiles();
    this.problemFiles = this.problemFilesService.files$;
    this.problemFilesService.findFiles();
    this.domainSpecFiles = this.domainSpecFilesService.files$;
    this.domainSpecFilesService.findFiles();
    this.projects$ = this.projectService.getList();

    this.editedProject = data.project;
    if (this.editedProject) {
      this.projectForm.controls.name.setValue(this.editedProject.name);
      this.projectForm.controls.description.setValue(this.editedProject.description);
      this.selectedDomain = this.editedProject.domainFile;
      this.selectedProblem = this.editedProject.problemFile;
      this.disableSelect = true;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSave(): void {
    console.log('Save project');
    const newProject: Project = {
      _id: this.editedProject ? this.editedProject._id : null,
      name: this.projectForm.controls.name.value,
      user: this.userService.getUser()._id,
      description: this.projectForm.controls.description.value,
      domainFile: this.selectedDomain,
      problemFile: this.selectedProblem,
      domainSpecification: this.selectedDomainSpec,
      // properties: [],
    };

    this.projectService.saveObject(newProject);

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

}
