import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { UserStudy } from "../../../interface/user-study/user-study";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DOCUMENT } from "@angular/common";
import { UserStudyUserService } from "../../../user_study/service/user-study-user.service";
import { TimeLoggerService } from "../../../service/logger/time-logger.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatCardModule } from "@angular/material/card";
import { MatIcon, MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-user-study-end",
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: "./user-study-end.component.html",
  styleUrls: ["./user-study-end.component.css"],
})
export class UserStudyEndComponent implements OnInit {

  userStudy: UserStudy;

  constructor(
    private timeLogger: TimeLoggerService,
    // private userStudyUserService: UserStudyUserService,
    // userStudyService: RunningUserStudyService,
    @Inject(DOCUMENT) private document: Document
  ) {
    // userStudyService
    //   .getSelectedObject()
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((study) => {
    //     this.userStudy = study;
    //   });
  }

  async ngOnInit(): Promise<void> {
    await this.timeLogger.store();
    // console.log('Time Logger stored.');
    // await this.userStudyUserService.logout();
    // console.log('Logout completed.');
  }


  redirectTo() {
    this.document.location.href = this.userStudy?.redirectUrl;
  }
}
