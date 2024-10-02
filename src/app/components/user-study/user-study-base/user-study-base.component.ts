import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import {
  RunningUserStudyService,
  UserStudiesService,
} from "../../../service/user-study/user-study-services";
import { ResponsiveService } from "../../../service/responsive/responsive.service";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-user-study-base",
  templateUrl: "./user-study-base.component.html",
  styleUrls: ["./user-study-base.component.css"],
})
export class UserStudyBaseComponent implements OnInit {

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
  ) {}

  ngOnInit(): void {
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntilDestroyed())
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();
  }

}
