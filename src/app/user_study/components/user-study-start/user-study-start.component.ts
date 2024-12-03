import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { UserStudy } from "../../domain/user-study";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { USUser } from "../../domain/user-study-user";
import { MatCardModule } from "@angular/material/card";
import { MatRadioModule } from "@angular/material/radio";
import { FormsModule, NgModel, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-user-study-start",
  standalone: true,
  imports: [
    MatCardModule,
    MatRadioModule,
    FormsModule
  ],
  templateUrl: "./user-study-start.component.html",
  styleUrls: ["./user-study-start.component.css"],
})
export class UserStudyStartComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();

  continue = false;
  userRegistered = false;
  error = false;
  errorMessage: string = null;

  userStudyId: string;
  userStudy: UserStudy;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.userStudyUserService.removeToken(); // TODO only for testing
    this.getUserStudyId();
  }

  getUserStudyId() {
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: ParamMap) => {
        this.userStudyId = params.get("userStudyId");
      });
  }

  initUserStudy() {
    this.route.paramMap
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: ParamMap) => {
        const userStudyId = params.get("userStudyId");
        // this.userStudiesService
        //   .getObject(userStudyId)
        //   .pipe(takeUntil(this.ngUnsubscribe))
        //   .subscribe((study) => {
        //     if (study) {
        //       this.userStudy = study;
        //       this.selectedUserStudyService.saveObject(study);
        //     }
        //   });
      });
  }

  getProlificIDs(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.route.queryParams
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((params) => {
          const prolificPID = params.PROLIFIC_PID;
          const studyID = params.STUDY_ID;
          const sessionID = params.SESSION_ID;
          if (prolificPID && studyID) {
            resolve([prolificPID, studyID]);
          } else {
            // resolve(['000000000', '000000000']);
            reject(null);
          }
        });
    });
  }

  userStudyValid() {
    return this.userStudy != null;
  }

  dateValid() {
    if (!this.userStudy) {
      return false;
    }
    const date = new Date();
    const start = new Date(this.userStudy.startDate);
    const end = new Date(this.userStudy.endDate);
    return date > start && date < end;
  }

  async onAgree() {
    // if (this.authenticationService.loggedIn()) {
    //   const prolificUser: USUser = {
    //     prolificId: "000000",
    //     userStudyExtId: "000000",
    //   };
    //   console.log("Register user");
    //   // this.userRegistered = await this.userStudyUserService.register(prolificUser, this.userStudyId);
    //   if (this.userRegistered) {
    //     this.initUserStudy();
    //   }
    //   return;
    // }

    this.getProlificIDs().then(
      async (ids) => {
        const prolificUser: USUser = {
          prolificId: ids[0],
          userStudyExtId: ids[1]
        };

        // this.userRegistered = await this.userStudyUserService.register(prolificUser, this.userStudyId);
        if (this.userRegistered) {
          this.initUserStudy();
        }
      },
      () => {
        this.error = true;
        this.errorMessage = "No valid user study link.";
      }
    );

  }
}
