import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MarkedPipe } from "src/app/pipes/marked.pipe";
import { DemoNavigatorComponent } from "../../../demo/components/demo-navigator/demo-navigator.component";

@Component({
  selector: "app-user-study-description-view",
  standalone: true,
  imports: [
    MatCardModule,
    MarkedPipe,
  ],
  templateUrl: "./user-study-description-view.component.html",
  styleUrls: ["./user-study-description-view.component.css"],
})
export class UserStudyDescriptionViewComponent implements OnInit {
  @Input() content: string;
  @Output() next = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  nextStep() {
    this.next.emit();
  }
}
