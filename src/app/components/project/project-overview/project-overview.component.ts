import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';
import { Observable } from 'rxjs';
import { PlanProperty } from 'src/app/interface/plan-property';
import { Project } from 'src/app/interface/project';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

  isMobile: boolean;

  properties$: Observable<PlanProperty[]>;
  currentProject: Project;

  constructor(
    private responsiveService: ResponsiveService,
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService) {
      this.properties$ = this.propertiesService.collection$;
      this.currentProjectService.selectedObject$.subscribe(project => {
        if (project !== null) {
          this.currentProject = project;
          this.propertiesService.findCollection([{param: 'projectId', value: project._id}]);
        }
      });
    }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus().subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
    this.responsiveService.checkWidth();
  }

}
