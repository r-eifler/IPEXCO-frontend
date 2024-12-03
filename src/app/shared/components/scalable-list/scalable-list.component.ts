import { CurrencyPipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { MatIcon, MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-scalable-list",
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: "./scalable-list.component.html",
  styleUrls: ["./scalable-list.component.css"],
})
export class ScalableListComponent implements OnInit {
  @Input() icon: string;

  constructor() {}

  ngOnInit(): void {}
}
