import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { RunningUserStudyService } from "../../../service/user-study/user-study-services";
import { ResponsiveService } from "../../../service/responsive/responsive.service";
import {
  UserStudy,
  UserStudyStep,
  UserStudyStepType,
} from "../../../interface/user-study/user-study";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-user-study-executer",
  templateUrl: "./user-study-execute.component.html",
  styleUrls: ["./user-study-execute.component.css"],
})
export class UserStudyExecuteComponent implements OnInit {
  isMobile: boolean;

  stepType = UserStudyStepType;

  userStudy: UserStudy;
  currentStep: UserStudyStep;
  currentStepIndex = 0;

  constructor(
    private selectedUserStudyService: RunningUserStudyService,
    private responsiveService: ResponsiveService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectedUserStudyService
      .getSelectedObject()
      .pipe(takeUntilDestroyed())
      .subscribe((study) => {
        this.userStudy = study;
        this.currentStep = study?.steps[0];
      });
  }

  ngOnInit(): void {
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntilDestroyed())
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();
  }


  async nextStep() {
    if (this.hasNextStep()) {
      this.currentStep = this.userStudy.steps[++this.currentStepIndex];
    } else {
      await this.router.navigate(
        ["".concat(...["/user-studies/" + this.userStudy._id + "/run/end"])],
        { relativeTo: this.route }
      );
    }
  }

  hasNextStep() {
    return this.currentStepIndex < this.userStudy.steps.length - 1;
  }
}
