import { takeUntil } from 'rxjs/operators';
import { PlanProperty } from 'src/app/interface/plan-property';
import { ViewSettingsService } from 'src/app/service/setting.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PropertyCreatorComponent} from '../property-creator/property-creator.component';
import {Observable, Subject} from 'rxjs';
import { PlanPropertyCollectionService } from 'src/app/service/plan-property-services';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { ViewSettings } from 'src/app/interface/view-settings';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectionListChange } from '@angular/material/list/selection-list';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { SelectionModel, SelectionChange } from '@angular/cdk/collections';
import { ɵangular_packages_router_router_n } from '@angular/router';

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

  displayedColumns: string[] = ['select', 'description', 'options'];
  dataSource = new MatTableDataSource<PlanProperty>(this.planProperties);
  selection = new SelectionModel<PlanProperty>(true, [], true);

  @ViewChild('#plan-property-collection-table') propertyTable: MatTable<PlanProperty>;

  constructor(
    private responsiveService: ResponsiveService,
    private propertiesService: PlanPropertyCollectionService,
    private viewSettingsService: ViewSettingsService,
    public dialog: MatDialog) {

    this.viewSettings = this.viewSettingsService.getSelectedObject();

    this.propertiesService.getList()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(props => {
      this.planProperties = props;
      this.dataSource.data = props;
      this.selection.select(... props.filter(v => v.isUsed));
      if (this.propertyTable) {
        this.propertyTable.renderRows();
      }
    });

    this.selection.changed
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((change: SelectionChange<PlanProperty>) => {
      // console.log('Selection changed: added: ' + change.added.length + ' removed: ' + change.removed.length);
      for (const p of  change.added) {
        if (! p.isUsed){
          p.isUsed = true;
          this.propertiesService.saveObject(p);
        }
      }
      for (const p of  change.removed) {
        if (p.isUsed){
          p.isUsed = false;
          this.propertiesService.saveObject(p);
        }
      }
    });
  }

  ngOnInit(): void {
    this.responsiveService.getMobileStatus()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( isMobile => {
      if (isMobile) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
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

  onSelectionChanged(event: MatSelectionListChange) {
    const selectedProp: PlanProperty = event.option.value;
    selectedProp.isUsed = ! selectedProp.isUsed;
    this.propertiesService.saveObject(selectedProp);
  }

  new_property_form(): void {
    const dialogRef = this.dialog.open(PropertyCreatorComponent, {
      width: '1000px'
    });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: PlanProperty): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

}
