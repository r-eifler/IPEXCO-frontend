import { Component, OnInit } from '@angular/core';
import {ProjectCreatorComponent} from '../../project/project-creator/project-creator.component';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PropertyCreatorComponent} from '../property-creator/property-creator.component';
import {CurrentProjectService, PlanPropertyCollectionService} from '../../../_service/general-services';
import {Observable} from 'rxjs';
import {Project} from '../../../_interface/project';
import {PlanProperty} from '../../../_interface/plan-property';

@Component({
  selector: 'app-property-collection',
  templateUrl: './property-collection.component.html',
  styleUrls: ['./property-collection.component.css']
})
export class PropertyCollectionComponent implements OnInit {
  properties$: Observable<PlanProperty[]>;
  private currentProject$: Observable<Project>;

  constructor(
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService,
    public dialog: MatDialog) {
    this.properties$ = this.propertiesService.collection$;
    this.currentProject$ = this.currentProjectService.selectedObject$;
  }

  ngOnInit(): void {
    this.propertiesService.findCollection();
  }

  delete(property): void {
    this.propertiesService.deleteObject(property);
  }

  new_property_form(): void {
    const dialogRef = this.dialog.open(PropertyCreatorComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
