import { Project } from './../../../interface/project';
import { Component, OnInit } from '@angular/core';
import {ProjectCreatorComponent} from '../../project/project-creator/project-creator.component';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PropertyCreatorComponent} from '../property-creator/property-creator.component';
import {Observable} from 'rxjs';
import {PlanProperty} from '../../../interface/plan-property';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';

@Component({
  selector: 'app-property-collection',
  templateUrl: './property-collection.component.html',
  styleUrls: ['./property-collection.component.scss']
})
export class PropertyCollectionComponent implements OnInit {
  properties$: Observable<PlanProperty[]>;
  private currentProject: Project;

  constructor(
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService,
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
  }

  delete(property: PlanProperty): void {
    this.propertiesService.deleteObject(property);
  }

  new_property_form(): void {
    const dialogRef = this.dialog.open(PropertyCreatorComponent, {
      width: '1000px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
