import { defaultViewSettings } from './../../../interface/view-settings';
import { ViewSettingsMenuComponent } from '../../settings/view-settings-menu/view-settings-menu.component';
import { SchemaService } from './../../../service/schema.service';
import { Component, OnInit } from '@angular/core';
import {Project} from '../../../interface/project';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import { ProjectsService, CurrentProjectService } from 'src/app/service/project-services';
import { DomainSpecificationService } from 'src/app/service/domain-specification.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ViewSettingsService } from 'src/app/service/setting.service';

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
    private domainSpecService: DomainSpecificationService,
    private bottomSheet: MatBottomSheet
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
          this.domainSpecService.findSpec(this.project);
          // console.log(this.project);
        }
      }
    );
  }

  ngOnInit(): void {
  }

  openSettings() {
    this.bottomSheet.open(ViewSettingsMenuComponent);
  }

}
