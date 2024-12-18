import { NgFor, NgIf } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatListModule } from "@angular/material/list";
import { PDDLAction, FactToString, predicateToString } from "src/app/shared/domain/planning-task";

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
  @Input() action: PDDLAction;

  factOut = FactToString;
  predicatOut = predicateToString;

  constructor() {}

  ngOnInit(): void {}
}
