import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { MetaStudy } from "../../domain/participant-distribution";
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-study-selection-redirection",
    templateUrl: "./study-selection-redirection.component.html",
    styleUrls: ["./study-selection-redirection.component.css"],
    standalone: false
})
export class StudySelectionRedirectionComponent implements OnInit {

  metaStudy: MetaStudy;
  private prolificPID: string;
  private studyID: string;

  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    combineLatest([this.route.paramMap, this.route.queryParams])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, queryParams]) => {
        const metaStudyId = params.get("metaStudyId");

        this.prolificPID = queryParams.PROLIFIC_PID;
        this.studyID = queryParams.STUDY_ID;
        const sessionID = queryParams.SESSION_ID;
        if (!(this.prolificPID && this.studyID)) {
          this.error = true;
          return;
        }

        // this.metaStudiesService
        //   .getObject(metaStudyId)
        //   .pipe(takeUntilDestroyed())
        //   .subscribe(async (study) => {
        //     if (study) {
        //       this.metaStudy = study;
        //       await this.selectStudy();
        //     }
        //   });
      });
  }

  async selectStudy() {
    const numAcceptedUser: Map<string, number> = new Map<string, number>();
    for (const s of this.metaStudy.userStudies) {
      // numAcceptedUser.set(
        // s.userStudy as string,
        // await this.userStudiesService.getNumberAcceptedUsers(
        //   s.userStudy as string
        // )
      // );
    }

    const possible: string[] = [];
    for (const s of this.metaStudy.userStudies) {
      if (numAcceptedUser.get(s.userStudy as string) < s.numberTestPersons) {
        possible.push(s.userStudy as string);
      }
    }

    if (possible.length < 1) {
      this.error = true;
      return;
    }

    const selectedVersion = possible[this.getRandomInt(0, possible.length)];

    const qParams = { PROLIFIC_PID: this.prolificPID, STUDY_ID: this.studyID };
    await this.router.navigate(["../../", selectedVersion, "run", "start"], {
      relativeTo: this.route,
      queryParams: qParams,
    });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }


  ngOnInit(): void {}
}
