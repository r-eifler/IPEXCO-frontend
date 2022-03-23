import {takeUntil} from 'rxjs/operators';
import {PlanProperty} from 'src/app/interface/plan-property/plan-property';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PropertyCreatorComponent} from '../property-creator/property-creator.component';
import {PlanPropertyMapService} from 'src/app/service/plan-properties/plan-property-services';
import {ResponsiveService} from 'src/app/service/responsive/responsive.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-property-collection',
  templateUrl: './property-collection.component.html',
  styleUrls: ['./property-collection.component.scss']
})
export class PropertyCollectionComponent implements OnInit, AfterViewInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;
  expertView = false;

  planProperties: PlanProperty[] = [];

  displayedColumns: string[] = ['select', 'description', 'globalHardGoal', 'value', 'options'];
  dataSource = new MatTableDataSource<PlanProperty>(this.planProperties);

  @ViewChild('#plan-property-collection-table') propertyTable: MatTable<PlanProperty>;

  constructor(
    private responsiveService: ResponsiveService,
    private propertiesService: PlanPropertyMapService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) {

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
    this.download_properties();
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

  modifyNaturalLanguageDescription(planProperty: PlanProperty, description: Element, cellElement: Element) {
    cellElement.removeChild(description);
    const input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('style', 'width: 80%;');
    input.value = planProperty.naturalLanguageDescription;

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        planProperty.naturalLanguageDescription = input.value;
        this.propertiesService.saveObject(planProperty);
        cellElement.removeChild(input);
        const newDescription = document.createElement('h3');
        newDescription.innerText = planProperty.naturalLanguageDescription;
        cellElement.appendChild(newDescription);
      }
    });

    cellElement.appendChild(input);
  }

  download_properties() {
    const jsonProps = JSON.stringify(this.planProperties);
    const file = new Blob([jsonProps], {type: 'plain/text'});
    const a: any = document.getElementById('prop_download');
    a.href = URL.createObjectURL(file);
    a.download = 'plan_properties.txt';
  }

}
