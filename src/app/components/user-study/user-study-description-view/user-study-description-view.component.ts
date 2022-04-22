import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-user-study-description-view",
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
