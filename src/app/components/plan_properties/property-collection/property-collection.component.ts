import { PlanProperty } from 'src/app/interface/plan-property';
import { ViewSettingsService } from 'src/app/service/setting.service';
import { ViewSettingsStore } from './../../../store/stores.store';
import { Project } from './../../../interface/project';
import { Component, OnInit } from '@angular/core';
import {ProjectCreatorComponent} from '../../project/project-creator/project-creator.component';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PropertyCreatorComponent} from '../property-creator/property-creator.component';
import {Observable} from 'rxjs';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { CurrentProjectService } from 'src/app/service/project-services';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { ViewSettings } from 'src/app/interface/view-settings';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectionListChange } from '@angular/material/list/selection-list';

@Component({
  selector: 'app-property-collection',
  templateUrl: './property-collection.component.html',
  styleUrls: ['./property-collection.component.scss']
})
export class PropertyCollectionComponent implements OnInit {

  isMobile: boolean;
  viewSettings: Observable<ViewSettings>;

  planProperties: PlanProperty[];

  constructor(
    private responsiveService: ResponsiveService,
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService,
    private viewSettingsStore: ViewSettingsStore,
    private viewSettingsService: ViewSettingsService,
    public dialog: MatDialog) {

    this.viewSettings = this.viewSettingsStore.item$;
    this.viewSettings.subscribe(v => {
      console.log(v);
    });
    this.propertiesService.collection$.subscribe(props => {
      this.planProperties = props;
    });

    // this.currentProjectService.selectedObject$.subscribe(project => {
    //   if (project !== null) {
    //     this.propertiesService.findCollection([{param: 'projectId', value: project._id}]);
    //   }
    // });
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

  delete(property: PlanProperty): void {
    this.propertiesService.deleteObject(property);
  }

  usePlanProperty(event: MatCheckboxChange, property: PlanProperty): void {
    property.isUsed = event.checked;
    this.propertiesService.saveObject(property);
  }

  onSelectionChanged(event: MatSelectionListChange) {
    const selectedProp: PlanProperty = event.option.value;
    selectedProp.isUsed = ! selectedProp.isUsed;
    this.propertiesService.saveObject(selectedProp);
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
