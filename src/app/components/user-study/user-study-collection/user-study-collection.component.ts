import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserStudy } from "../../../interface/user-study/user-study";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardContent, MatCardModule } from "@angular/material/card";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-user-study-selection",
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    MatLabel,
    MatFormFieldModule,
    DatePipe
  ],
  templateUrl: "./user-study-collection.component.html",
  styleUrls: ["./user-study-collection.component.css"],
})
export class UserStudyCollectionComponent implements OnInit {
  urlBase = environment.localURL + "/user-studies";

  isMobile: boolean;

  userStudies$: Observable<UserStudy[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    // userStudiesService.findCollection();
  }

  ngOnInit(): void {


    // this.userStudies$ = this.userStudiesService.getList();
  }

  async openInfo(study: UserStudy) {
    // this.selectedUserStudyService.saveObject(study);
    await this.router.navigate(["../user-studies/" + study._id], {
      relativeTo: this.route,
    });
  }

  async newUserStudy() {
    // this.selectedUserStudyService.saveObject(null);
    await this.router.navigate(["./new-user-study"], {
      relativeTo: this.route,
    });
  }

  delete(study: UserStudy) {
    // this.userStudiesService.deleteObject(study);
  }

  getStudyLink(study: UserStudy) {
    return this.urlBase + "/" + study._id + "/run/start";
  }
}
