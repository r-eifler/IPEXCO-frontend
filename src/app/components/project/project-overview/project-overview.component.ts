import { DemoCreatorComponent } from './../../demo/demo-creator/demo-creator.component';
import { DemosService } from './../../../service/demo-services';
import { PlanRun } from 'src/app/interface/run';
import { RunService } from './../../../service/run-services';
import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';
import { Observable } from 'rxjs';
import { PlanProperty } from 'src/app/interface/plan-property';
import { Project } from 'src/app/interface/project';
import { Demo } from 'src/app/interface/demo';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

  isMobile: boolean;

  currentProject: Project;
  properties$: Observable<PlanProperty[]>;
  runs$: Observable<PlanRun[]>;

  constructor(
    private responsiveService: ResponsiveService,
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService,
    public runsService: RunService,
    public demosService: DemosService,
    public dialog: MatDialog) {
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

  createDemo(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data  = {
      project: this.currentProject,
    };

    const dialogRef = this.dialog.open(DemoCreatorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
