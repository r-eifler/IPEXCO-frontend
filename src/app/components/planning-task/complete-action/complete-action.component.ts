import { Component, Input, OnInit } from "@angular/core";
import { PDDLAction, FactToString, predicateToString } from "src/app/interface/planning-task";

@Component({
  selector: "app-complete-action",
  templateUrl: "./complete-action.component.html",
  styleUrls: ["./complete-action.component.scss"],
})
export class CompleteActionComponent implements OnInit {
  @Input() action: PDDLAction;

  factOut = FactToString;
  predicatOut = predicateToString;

  constructor() {}

  ngOnInit(): void {}
}
