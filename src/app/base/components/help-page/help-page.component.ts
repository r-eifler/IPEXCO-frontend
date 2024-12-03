import { Component, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatLabel } from "@angular/material/form-field";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-help-page",
  standalone: true,
  imports: [
    MatCardModule,
    MatTabsModule,
    MatStepperModule,
  ],
  templateUrl: "./help-page.component.html",
  styleUrls: ["./help-page.component.css"],
})
export class HelpPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
