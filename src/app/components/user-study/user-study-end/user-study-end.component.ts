import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { RunningUserStudyService } from "../../../service/user-study/user-study-services";
import { UserStudy } from "../../../interface/user-study/user-study";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";
import { UserStudyUserService } from "../../../service/user-study/user-study-user.service";
import { TimeLoggerService } from "../../../service/logger/time-logger.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-user-study-end",
  templateUrl: "./user-study-end.component.html",
  styleUrls: ["./user-study-end.component.css"],
})
export class UserStudyEndComponent implements OnInit {

  userStudy: UserStudy;

  constructor(
    private timeLogger: TimeLoggerService,
    private userStudyUserService: UserStudyUserService,
    userStudyService: RunningUserStudyService,
    @Inject(DOCUMENT) private document: Document
  ) {
    userStudyService
      .getSelectedObject()
      .pipe(takeUntilDestroyed())
      .subscribe((study) => {
        this.userStudy = study;
      });
  }

  async ngOnInit(): Promise<void> {
    await this.timeLogger.store();
    // console.log('Time Logger stored.');
    await this.userStudyUserService.logout();
    // console.log('Logout completed.');
  }


  redirectTo() {
    this.document.location.href = this.userStudy?.redirectUrl;
  }
}
