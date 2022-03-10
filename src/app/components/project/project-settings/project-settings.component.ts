import { ProjectsService, CurrentProjectService } from 'src/app/service/project/project-services';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ExecutionSettings } from 'src/app/interface/settings/execution-settings';
import { Project } from 'src/app/interface/project';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject();

  demoSettingsForm: FormGroup;

  name: string;
  settings: ExecutionSettings;
  project: Project


  constructor(
    private projectService: CurrentProjectService,
    private projectCollectionService: ProjectsService) {

      this.demoSettingsForm = new FormGroup({
        maxRuns: new FormControl(
          [Validators.required, Validators.min(1), Validators.max(100)]),
        allowQuestions: new FormControl(),
        maxQuestionSize: new FormControl(
          [Validators.required, Validators.min(1), Validators.max(3)]),
        introTask: new FormControl(),
        public: new FormControl(),
        usePlanPropertyValues: new FormControl(),
        useTimer: new FormControl(),
        measureTime: new FormControl(),
        maxTime: new FormControl([ Validators.required, Validators.min(0.05), Validators.max(60) ]),
        checkMaxUtility: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.projectService.findSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(project => {
      if (project){
        this.project = project;
        this.settings = project.settings;
        this.initForm();
      }
    });
  }

  initForm(): void {
    this.demoSettingsForm.controls.maxRuns.setValue(this.settings.maxRuns);
    this.demoSettingsForm.controls.allowQuestions.setValue(this.settings.allowQuestions);
    this.demoSettingsForm.controls.maxQuestionSize.setValue(this.settings.maxQuestionSize);
    this.demoSettingsForm.controls.introTask.setValue(this.settings.introTask);
    this.demoSettingsForm.controls.public.setValue(this.project.public);
    this.demoSettingsForm.controls.usePlanPropertyValues.setValue(this.settings.usePlanPropertyValues);
    this.demoSettingsForm.controls.useTimer.setValue(this.settings.useTimer);
    this.demoSettingsForm.controls.measureTime.setValue(this.settings.measureTime);
    this.demoSettingsForm.controls.maxTime.setValue(this.settings.maxTime);
    this.demoSettingsForm.controls.checkMaxUtility.setValue(this.settings.checkMaxUtility);


    this.demoSettingsForm.controls.maxQuestionSize.enable();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSave() {
    this.settings.maxRuns = parseInt(this.demoSettingsForm.controls.maxRuns.value);
    this.settings.allowQuestions = this.demoSettingsForm.controls.allowQuestions.value;
    this.settings.maxQuestionSize = +this.demoSettingsForm.controls.maxQuestionSize.value;
    this.settings.introTask = this.demoSettingsForm.controls.introTask.value;
    this.settings.usePlanPropertyValues = this.demoSettingsForm.controls.usePlanPropertyValues.value;
    this.settings.useTimer = this.demoSettingsForm.controls.useTimer.value;
    this.settings.measureTime = this.demoSettingsForm.controls.measureTime.value;
    this.settings.maxTime = this.demoSettingsForm.controls.maxTime.value * 60000;
    this.settings.checkMaxUtility = this.demoSettingsForm.controls.checkMaxUtility.value;

    this.project.settings = this.settings;
    this.project.public = this.demoSettingsForm.controls.public.value;

    this.projectCollectionService.saveObject(this.project);
    this.projectService.saveObject(this.project);
    //TODO update new project in currently selected project
    //this.projectService.saveObject(this.project);

  }

}
