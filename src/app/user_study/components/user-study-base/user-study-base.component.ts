import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-user-study-base",
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: "./user-study-base.component.html",
  styleUrls: ["./user-study-base.component.css"],
})
export class UserStudyBaseComponent implements OnInit {

  isMobile: boolean;

  constructor(
  ) {}

  ngOnInit(): void {
  }

}
