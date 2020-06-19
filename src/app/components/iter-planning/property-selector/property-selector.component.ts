import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PlanProperty} from '../../../interface/plan-property';
import {CurrentProjectService} from '../../../service/project-services';
import {PlannerService} from '../../../service/planner.service';
import {Observable, Subject} from 'rxjs';
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
export class PropertySelectorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  softProperties: PlanProperty[] = [
  ];

  hardProperties: PlanProperty[] = [
  ];

  collection$: Observable<PlanProperty[]>;
  private currentProject$: Observable<Project>;
  @Input() previousRun;

  constructor(
    private propertiesService: PlanPropertyCollectionService,
    private currentProjectService: CurrentProjectService,
    private plannerService: PlannerService,
    public dialog: MatDialog) {
      this.collection$ = this.propertiesService.getList();
      this.currentProject$ = this.currentProjectService.getSelectedObject();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

    dialogRef.afterClosed()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
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
    const expRun: ExplanationRun = {
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
    console.log(expRun);

    // this.plannerService.execute_mugs_run(expRun);
  }

}
