import { Component, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-main-info",
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: "./main-info.component.html",
  styleUrls: ["./main-info.component.css"],
})
export class MainInfoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
