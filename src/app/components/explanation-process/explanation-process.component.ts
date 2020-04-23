import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CurrentProjectService, ProjectsService} from '../../service/project-services';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IHTTPData} from '../../interface/http-data.interface';
import {Project} from '../../interface/project';

@Component({
  selector: 'app-explanation-process',
  templateUrl: './explanation-process.component.html',
  styleUrls: ['./explanation-process.component.css']
})
export class ExplanationProcessComponent implements OnInit, AfterViewInit {
  private project$: Observable<Project>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private currentProjectService: CurrentProjectService,
  ) { }

  title = 'EXPLORE-CLI';
  editorOptions = {theme: 'vs-dark', language: 'javascript'};

  @ViewChild('stepper') stepper: MatStepper;

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.projectsService.getObject(params.get('projectid')))
    );
    this.project$.subscribe(value => this.currentProjectService.saveObject(value));

  }

  ngAfterViewInit(): void {
    console.log( this.stepper.selectedIndex);
    this.stepper.selectedIndex = 0;
  }

}
