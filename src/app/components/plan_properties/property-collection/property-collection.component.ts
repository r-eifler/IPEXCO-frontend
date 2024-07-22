import { IconSelectorComponent } from './../../utils/icon-selector/icon-selector.component';
import { takeUntil } from "rxjs/operators";
import { PlanProperty } from "src/app/interface/plan-property/plan-property";
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { PropertyCreatorComponent } from "../property-creator/property-creator.component";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { Subject } from "rxjs";
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AskDeleteComponent } from '../../utils/ask-delete/ask-delete.component';

@Component({
  selector: "app-property-collection",
  templateUrl: "./property-collection.component.html",
  styleUrls: ["./property-collection.component.scss"],
})
export class PropertyCollectionComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private ngUnsubscribe: Subject<any> = new Subject();

  @Input() modOnlyVisualization = false;

  isMobile: boolean;
  expertView = false;

  planProperties: PlanProperty[] = [];

  displayedColumns: string[];

  dataSource = new MatTableDataSource<PlanProperty>(this.planProperties);

  @ViewChild("#plan-property-collection-table")
  propertyTable: MatTable<PlanProperty>;

  constructor(
    private responsiveService: ResponsiveService,
    private propertiesService: PlanPropertyMapService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet
  ) {
    this.propertiesService
      .getMap()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((props) => {
        const propsList = [...props.values()];
        this.planProperties = propsList;
        this.dataSource.data = propsList;
        console.log(propsList);
      });

  }

  propertyUsedChanged(prop: PlanProperty): void {
    prop.isUsed = !prop.isUsed;
    this.propertiesService.saveObject(prop);
  }

  propertyGlobalHardGoalChanged(prop: PlanProperty): void {
    prop.globalHardGoal = !prop.globalHardGoal;
    this.propertiesService.saveObject(prop);
  }

  propertyValueChanged(event, prop: PlanProperty): void {
    prop.value = event.target.value;
    this.propertiesService.saveObject(prop);
  }

  colorChanged(event, prop: PlanProperty): void {
    console.log('Color changed: ' + event)
    console.group(event);
    prop.color = event;
    this.propertiesService.saveObject(prop);
  }


  ngOnInit(): void {
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();

    if (this.modOnlyVisualization) {
      this.displayedColumns = [
        "description",
        "globalHardGoal",
        "value",
        "color",
        "icon",
        "class",
      ];
    } else{
      this.displayedColumns = [
        "select",
        "description",
        "globalHardGoal",
        "value",
        "color",
        "icon",
        "class",
        "options",
      ];
    }
  }

  ngAfterViewInit(): void {
    if (this.propertyTable) {
      this.propertyTable.renderRows();
    }
    if(!this.modOnlyVisualization)
      this.download_properties();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  openDeleteDialog(property: PlanProperty): void {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Property", text: "Are you sure you want to delete project: " + property.naturalLanguageDescription + "?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.propertiesService.deleteObject(property);
      }
    });
  }

  usePlanProperty(event: MatCheckboxChange, property: PlanProperty): void {
    property.isUsed = event.checked;
    this.propertiesService.saveObject(property);
  }

  new_property_form(): void {
    this.dialog.open(PropertyCreatorComponent, {
      width: "1000px",
    });
  }

  modifyNaturalLanguageDescription(
    planProperty: PlanProperty,
    description: Element,
    cellElement: Element
  ) {
    cellElement.removeChild(description);
    const input = document.createElement("input");
    input.type = "text";
    input.setAttribute("style", "width: 80%;");
    input.value = planProperty.naturalLanguageDescription;

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        planProperty.naturalLanguageDescription = input.value;
        this.propertiesService.saveObject(planProperty);
        cellElement.removeChild(input);
        const newDescription = document.createElement("h3");
        newDescription.innerText = planProperty.naturalLanguageDescription;
        cellElement.appendChild(newDescription);
      }
    });

    cellElement.appendChild(input);
  }

  modifyClass(
    planProperty: PlanProperty,
    propClass: Element,
    cellElement: Element
  ) {
    cellElement.removeChild(propClass);
    const input = document.createElement("input");
    input.type = "text";
    input.setAttribute("style", "width: 80%;");
    input.value = planProperty.class;

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        planProperty.class = input.value;
        this.propertiesService.saveObject(planProperty);
        cellElement.removeChild(input);
        const newDescription = document.createElement("h3");
        newDescription.innerText = planProperty.class;
        cellElement.appendChild(newDescription);
      }
    });

    cellElement.appendChild(input);
  }

  openIconSelector(prop: PlanProperty){

    let dialogRef = this.dialog.open(IconSelectorComponent, {
      height: '400px',
      width: '300px',
      data: { icon: prop.icon }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        prop.icon = result;
        console.log(prop.icon)
        this.propertiesService.saveObject(prop);
      }
    });

  }

  download_properties() {
    const jsonProps = JSON.stringify(this.planProperties);
    const file = new Blob([jsonProps], { type: "plain/text" });
    const a: any = document.getElementById("prop_download");
    a.href = URL.createObjectURL(file);
    a.download = "plan_properties.txt";
  }


  upload_properties() {
    // const jsonProps = JSON.stringify(this.planProperties);
    // const file = new Blob([jsonProps], { type: "plain/text" });
    // const a: any = document.getElementById("prop_download");
    // a.href = URL.createObjectURL(file);
    // a.download = "plan_properties.txt";
  }
}
