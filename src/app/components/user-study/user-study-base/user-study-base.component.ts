import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import {
  RunningUserStudyService,
  UserStudiesService,
} from "../../../service/user-study/user-study-services";
import { ResponsiveService } from "../../../service/responsive/responsive.service";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-user-study-base",
  templateUrl: "./user-study-base.component.html",
  styleUrls: ["./user-study-base.component.css"],
})
export class UserStudyBaseComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();
  isMobile: boolean;

  constructor(
    private userStudiesService: UserStudiesService,
    private selectedUserStudyService: RunningUserStudyService,
    private responsiveService: ResponsiveService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
