import {
  MetaFact,
  PlanningTaskRelaxationSpace,
} from "src/app/interface/planning-task-relaxation";
import { PlanningTaskRelaxationCreatorComponent } from "./../planning-task-relaxation-creator/planning-task-relaxation-creator.component";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PlanningTaskRelaxationService } from "src/app/service/planning-task/planning-task-relaxations-services";
import { Subject, Observable } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import {
  FactToString,
  predicateToString,
} from "src/app/interface/plannig-task";

interface InitUpdates {
  name: string;
  dimensions: { name: string; facts: MetaFact[] }[];
  space: PlanningTaskRelaxationSpace;
}

@Component({
  selector: "app-planning-task-relaxations",
  templateUrl: "./planning-task-relaxations.component.html",
  styleUrls: ["./planning-task-relaxations.component.scss"],
})
export class PlanningTaskRelaxationsComponent implements OnInit {
  json = JSON;
  predicatOut = predicateToString;
  factOut = FactToString;
  private ngUnsubscribe: Subject<any> = new Subject();

  relaxationSpaces$: Observable<InitUpdates[]>;

  constructor(
    private relaxationService: PlanningTaskRelaxationService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.relaxationSpaces$ = this.relaxationService.getList().pipe(
      filter((spaces) => !!spaces),
      map((spaces) =>
        spaces.map((space) => ({
          name: space.name,
          dimensions: space.dimensions.map((dim) => ({
            name: dim.name,
            facts: [dim.orgFact, ...dim.updates],
          })),
          space: space,
        }))
      )
    );
  }

  new_relaxation_form(): void {
    this.dialog.open(PlanningTaskRelaxationCreatorComponent, {
      width: "80%",
      height: "80%",
      data: null,
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  deleteRelaxation(space: PlanningTaskRelaxationSpace): void {
    this.relaxationService.deleteObject(space);
  }

  editRelaxation(space: PlanningTaskRelaxationSpace): void {
    this.dialog.open(PlanningTaskRelaxationCreatorComponent, {
      width: "80%",
      height: "80%",
      data: { space },
    });
  }
}
