import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  UserStudy,
  UserStudyStep,
  UserStudyStepType,
} from "../../../interface/user-study/user-study";
import { ActivatedRoute, Router } from "@angular/router";
import { UserStudyFormViewComponent } from "../user-study-form-view/user-study-form-view.component";
import { UserStudyDemoViewComponent } from "../user-study-demo-view/user-study-demo-view.component";
import { UserStudyDescriptionViewComponent } from "../user-study-description-view/user-study-description-view.component";

@Component({
  selector: "app-user-study-executer",
  standalone: true,
  imports: [
    UserStudyDemoViewComponent,
    UserStudyFormViewComponent,
    UserStudyDescriptionViewComponent,
  ],
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
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.selectedUserStudyService
    //   .getSelectedObject()
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((study) => {
    //     this.userStudy = study;
    //     this.currentStep = study?.steps[0];
    //   });
  }

  ngOnInit(): void {
    // this.responsiveService
    //   .getMobileStatus()
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((isMobile) => {
    //     this.isMobile = isMobile;
    //   });
    // this.responsiveService.checkWidth();
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
