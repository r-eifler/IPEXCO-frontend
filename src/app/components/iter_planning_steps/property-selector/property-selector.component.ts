import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { PlanProperty} from '../../../_interface/plan-property';
import {CurrentProjectService, PlanPropertyCollectionService} from '../../../_service/general-services';
import {PlannerService} from '../../../_service/planner.service';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PropertyCreatorComponent} from '../../plan_properties/property-creator/property-creator.component';
import {Project} from '../../../_interface/project';
import {Run} from '../../../_interface/run';

@Component({
  selector: 'app-property-selector',
  templateUrl: './property-selector.component.html',
  styleUrls: ['./property-selector.component.css']
})
export class PropertySelectorComponent implements OnInit {

  // collection = [
  //   {id: 1, name: 'use connection', formula: 'F drive t1 l1 l2'},
  //   {id: 1, name: 'delivery order', formula: '! unload p1 t1 l1 U unload p2 t1 l1'}
  // ];

  softProperties: PlanProperty[] = [
  ];

  hardProperties: PlanProperty[] = [
  ];

  collection$: Observable<PlanProperty[]>;
  private currentProject$: Observable<Project>;

  constructor(private propertiesService: PlanPropertyCollectionService,
              private currentProjectService: CurrentProjectService,
              private plannerService: PlannerService,
              public dialog: MatDialog) {
    this.collection$ = this.propertiesService.collection$;
    this.currentProject$ = this.currentProjectService.selectedObject$;
  }

  ngOnInit(): void {
    this.propertiesService.findCollection();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  new_property_form(): void {
    const dialogRef = this.dialog.open(PropertyCreatorComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  delete(property): void {
    this.propertiesService.deleteObject(property);
  }

  // create a new run with the currently selected properties
  compute_dependencies(): void {
    let cProject = null;
    const sub = this.currentProject$.subscribe((obj) => {cProject = obj; });
    sub.unsubscribe();
    const run: Run = {
      _id: null,
      name: 'TODO',
      status: null,
      project: cProject,
      soft_properties: this.softProperties,
      hard_properties: this.hardProperties,
      result: null,
      log: null,
    };

    console.log('Compute dependencies');
    console.log(run);

    this.plannerService.compute_mugs(run);
  }

}
