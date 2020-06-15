import {Component, Input, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PlanProperty} from '../../../interface/plan-property';
import {CurrentProjectService} from '../../../service/project-services';
import {PlannerService} from '../../../service/planner.service';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PropertyCreatorComponent} from '../../plan_properties/property-creator/property-creator.component';
import {Project} from '../../../interface/project';
import {ExplanationRun, RunType} from '../../../interface/run';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';

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
  @Input() previousRun;

  constructor(private propertiesService: PlanPropertyCollectionService,
              private currentProjectService: CurrentProjectService,
              private plannerService: PlannerService,
              public dialog: MatDialog) {
    this.collection$ = this.propertiesService.getList();
    this.currentProject$ = this.currentProjectService.selectedObject$;
  }

  ngOnInit(): void {
    // this.propertiesService.findCollection();
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
    const run: ExplanationRun = {
      _id: null,
      name: 'MUGS',
      status: null,
      type: RunType.mugs,
      planProperties: this.softProperties.concat(this.hardProperties),
      softGoals: this.softProperties, // TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      hardGoals: this.hardProperties,
      result: null,
      log: null,
    };

    console.log('Compute dependencies');
    console.log(run);

    // this.plannerService.execute_plan_run(run);
  }

}
