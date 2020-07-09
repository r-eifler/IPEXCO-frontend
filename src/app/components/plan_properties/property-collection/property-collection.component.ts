import {takeUntil} from 'rxjs/operators';
import {PlanProperty} from 'src/app/interface/plan-property/plan-property';
import {ViewSettingsService} from 'src/app/service/settings/setting.service';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PropertyCreatorComponent} from '../property-creator/property-creator.component';
import {Observable, Subject} from 'rxjs';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {ResponsiveService} from 'src/app/service/responsive/responsive.service';
import {ViewSettings} from 'src/app/interface/settings/view-settings';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatSelectionListChange} from '@angular/material/list/selection-list';
import {MatTable, MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-property-collection',
  templateUrl: './property-collection.component.html',
  styleUrls: ['./property-collection.component.scss']
})
export class PropertyCollectionComponent implements OnInit, AfterViewInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;
  viewSettings: Observable<ViewSettings>;

  planProperties: PlanProperty[];

  displayedColumns: string[] = ['select', 'description', 'globalHardGoal', 'value', 'options'];
  dataSource = new MatTableDataSource<PlanProperty>(this.planProperties);

  @ViewChild('#plan-property-collection-table') propertyTable: MatTable<PlanProperty>;

  constructor(
    private responsiveService: ResponsiveService,
    private propertiesService: PlanPropertyMapService,
    private viewSettingsService: ViewSettingsService,
    public dialog: MatDialog) {

    this.viewSettings = this.viewSettingsService.getSelectedObject();

    this.propertiesService.getMap()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(props => {
      const propsList = [...props.values()];
      this.planProperties = propsList;
      this.dataSource.data = propsList;
    });

  }

  propertyUsedChanged(prop: PlanProperty): void {
    prop.isUsed = ! prop.isUsed;
    this.propertiesService.saveObject(prop);
  }

  propertyGlobalHardGoalChanged(prop: PlanProperty): void {
    prop.globalHardGoal = ! prop.globalHardGoal;
    this.propertiesService.saveObject(prop);
  }

  propertyValueChanged(event,  prop: PlanProperty): void {
    prop.value = event.target.value;
    this.propertiesService.saveObject(prop);
  }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      this.isMobile = isMobile;
    });
    this.responsiveService.checkWidth();
  }

  ngAfterViewInit(): void {
    if (this.propertyTable) {
      this.propertyTable.renderRows();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  delete(property: PlanProperty): void {
    this.propertiesService.deleteObject(property);
  }

  usePlanProperty(event: MatCheckboxChange, property: PlanProperty): void {
    property.isUsed = event.checked;
    this.propertiesService.saveObject(property);
  }

  new_property_form(): void {
    this.dialog.open(PropertyCreatorComponent, {
      width: '1000px'
    });
  }

}
