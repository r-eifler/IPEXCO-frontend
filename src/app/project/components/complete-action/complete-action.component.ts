import { NgFor, NgIf } from "@angular/common";
import { Component, input, Input, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { FactToString, PDDLAction, predicateToString } from "src/app/shared/domain/PDDL_task";

@Component({
    selector: "app-complete-action",
    imports: [
        MatListModule,
        MatExpansionModule,
        MatCardModule,
        NgFor,
    ],
    templateUrl: "./complete-action.component.html",
    styleUrls: ["./complete-action.component.scss"]
})
export class CompleteActionComponent implements OnInit {

  action = input.required<PDDLAction>();

  factOut = FactToString;
  predicatOut = predicateToString;

  constructor() {}

  ngOnInit(): void {}
}
