import { SchemaService } from './../../../service/schema.service';
import { Component, OnInit } from '@angular/core';
import {Project} from '../../../interface/project';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import { ProjectsService, CurrentProjectService } from 'src/app/service/project-services';

@Component({
  selector: 'app-project-base',
  templateUrl: './project-base.component.html',
  styleUrls: ['./project-base.component.css']
})
export class ProjectBaseComponent implements OnInit {

  project: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProjectsService,
    private currentProjectService: CurrentProjectService,
    private curretnSchemaService: SchemaService,
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getObject(params.get('projectid')))
    ).subscribe(
      value => {
        if (value != null) {
          this.project = value;
          this.currentProjectService.saveObject(this.project);
          console.log('Project base: ');
          console.log(this.project);
          this.curretnSchemaService.findSchema(this.project);
          // console.log(this.project);
        }
      }
    );
  }

  ngOnInit(): void {
  }

}
