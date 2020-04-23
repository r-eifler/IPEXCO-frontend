import { Project } from './../../../interface/project';
import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {PddlFilesService} from '../../../service/pddl-files.service';
import {Observable} from 'rxjs';
import {PDDLFile} from '../../../interface/pddlfile';
import {DomainFilesService, ProblemFilesService} from '../../../service/pddl-file-services';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProjectsService } from 'src/app/service/project-services';

@Component({
  selector: 'app-project-creator',
  templateUrl: './project-creator.component.html',
  styleUrls: ['./project-creator.component.css']
})
export class ProjectCreatorComponent implements OnInit {

  // form fields
  projectForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
  });

  domainFiles$: Observable<PDDLFile[]>;
  problemFiles: Observable<PDDLFile[]>;

  selectedDomain: PDDLFile;
  selectedProblem: PDDLFile;

  projects$: Observable<Project[]>;

  editedProject: Project;
  disableSelect = false;


  constructor(private domainFilesService: DomainFilesService,
              private problemFilesService: ProblemFilesService,
              private projectService: ProjectsService,
              public dialogRef: MatDialogRef<ProjectCreatorComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
    this.domainFiles$ = this.domainFilesService.files$;
    this.problemFiles = this.problemFilesService.files$;
    this.projects$ = this.projectService.collection$;

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
    this.domainFilesService.findFiles().subscribe();
    this.problemFilesService.findFiles().subscribe();
  }

  onSave(): void {
    console.log('Save project');
    const newProject: Project = {
      _id: this.editedProject ? this.editedProject._id : null,
      name: this.projectForm.controls.name.value,
      description: this.projectForm.controls.description.value,
      domainFile: this.selectedDomain,
      problemFile: this.selectedProblem,
      // properties: [],
    };

    console.log('Save new Project: ');
    console.log(newProject);

    this.projectService.saveObject(newProject);

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

}
