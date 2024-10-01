import { map } from "rxjs/operators";
import { PlanProperty } from "src/app/iterative_planning/domain/plan-property/plan-property";
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { PropertyCreatorComponent } from "../property-creator/property-creator.component";
import { Observable, Subject } from "rxjs";
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AskDeleteComponent } from 'src/app/components/utils/ask-delete/ask-delete.component';
import { IconSelectorComponent } from "src/app/components/utils/icon-selector/icon-selector.component";
import { Store } from "@ngrx/store";
import { selectIterativePlanningProperties, selectIterativePlanningPropertiesList } from "src/app/iterative_planning/state/iterative-planning.selector";
import { deletePlanProperty, updatePlanProperty } from "src/app/iterative_planning/state/iterative-planning.actions";


@Component({
  selector: "app-property-collection",
  templateUrl: "./property-collection.component.html",
  styleUrls: ["./property-collection.component.scss"],
})
export class PropertyCollectionComponent
  implements OnInit, AfterViewInit
{
  private ngUnsubscribe: Subject<any> = new Subject();

  @Input() modOnlyVisualization: boolean = false;

  isMobile: boolean;
  expertView = false;

  displayedColumns: string[];

  dataSource = new MatTableDataSource<PlanProperty>();

  dataSource$: Observable<MatTableDataSource<PlanProperty>>;
  planProperties$: Observable<PlanProperty[]>

  @ViewChild("#plan-property-collection-table")
  propertyTable: MatTable<PlanProperty>;

  constructor(
    private store: Store,
    public dialog: MatDialog,
  ) {

    this.dataSource$ = this.store.select(selectIterativePlanningPropertiesList).pipe(
      map(pp => {
        const dataSource = this.dataSource;
        dataSource.data = pp;
        return dataSource;
      })
    );

    this.planProperties$ = this.store.select(selectIterativePlanningPropertiesList)

  }

  propertyUsedChanged(prop: PlanProperty): void {
    let newProperty = {...prop, isUsed: !prop.isUsed}
    this.store.dispatch(updatePlanProperty({planProperty: newProperty}))
  }

  usePlanProperty(event: MatCheckboxChange, property: PlanProperty): void {
    let newProperty = {...property, isUsed: event.checked}
    this.store.dispatch(updatePlanProperty({planProperty: newProperty}))
  }

  propertyGlobalHardGoalChanged(prop: PlanProperty): void {
    let newProperty = {...prop, globalHardGoal: !prop.globalHardGoal}
    this.store.dispatch(updatePlanProperty({planProperty: newProperty}))
  }

  propertyValueChanged(event, prop: PlanProperty): void {
    let newProperty = {...prop, value: event.target.value}
    this.store.dispatch(updatePlanProperty({planProperty: newProperty}))
  }

  colorChanged(event, prop: PlanProperty): void {
    let newProperty = {...prop, color: event}
    this.store.dispatch(updatePlanProperty({planProperty: newProperty}))
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

        let newProperty = {...planProperty, naturalLanguageDescription: input.value}
        this.store.dispatch(updatePlanProperty({planProperty: newProperty}))

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
        
        let newProperty = {...planProperty, class: input.value}
        this.store.dispatch(updatePlanProperty({planProperty: newProperty}))

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
        let newProperty = {...prop, icon: result}
        this.store.dispatch(updatePlanProperty({planProperty: newProperty}))
      }
    });

  }
  

  ngOnInit(): void {

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


  openDeleteDialog(property: PlanProperty): void {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Property", text: "Are you sure you want to delete project: " + property.naturalLanguageDescription + "?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.store.dispatch(deletePlanProperty({id: property._id}))
      }
    });
  }

  new_property_form(): void {
    this.dialog.open(PropertyCreatorComponent, {
      width: "1000px",
    });
  }



  download_properties() {
    // const jsonProps = JSON.stringify(this.planProperties);
    // const file = new Blob([jsonProps], { type: "plain/text" });
    // const a: any = document.getElementById("prop_download");
    // a.href = URL.createObjectURL(file);
    // a.download = "plan_properties.txt";
  }


  upload_properties() {
    // const jsonProps = JSON.stringify(this.planProperties);
    // const file = new Blob([jsonProps], { type: "plain/text" });
    // const a: any = document.getElementById("prop_download");
    // a.href = URL.createObjectURL(file);
    // a.download = "plan_properties.txt";
  }
}
