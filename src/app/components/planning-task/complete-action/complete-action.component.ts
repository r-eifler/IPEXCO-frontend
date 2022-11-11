import { Component, Input, OnInit } from "@angular/core";
import { Action, FactToString, predicateToString } from "src/app/interface/plannig-task";

@Component({
  selector: "app-complete-action",
  templateUrl: "./complete-action.component.html",
  styleUrls: ["./complete-action.component.scss"],
})
export class CompleteActionComponent implements OnInit {
  @Input() action: Action;

  factOut = FactToString;
  predicatOut = predicateToString;

  constructor() {}

  ngOnInit(): void {}
}
