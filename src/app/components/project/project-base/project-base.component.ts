import { Component, OnInit } from '@angular/core';
import {Project} from '../../../_interface/project';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {ProjectsService} from '../../../_service/general-services';
import {switchMap} from 'rxjs/operators';

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
    private service: ProjectsService
  ) {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.service.getObject(params.get('projectid')))
    ).subscribe(
      value => { this.project = value.data; }
    );
  }

  ngOnInit(): void {
  }

}
