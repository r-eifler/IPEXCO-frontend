import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Demo } from "src/app/project/domain/demo";
import { UserStudy } from "../../../user_study/domain/user-study";
import { MatIcon } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { Project } from "src/app/shared/domain/project";

@Component({
    selector: "app-user-main-page",
    imports: [
        MatIcon,
        MatButtonModule,
        MatCardModule
    ],
    templateUrl: "./user-main-page.component.html",
    styleUrls: ["./user-main-page.component.scss"]
})
export class UserMainPageComponent {

  isMobile: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}


  async openProject(project: Project) {
    await this.router.navigate(
      ["".concat(...["/project/", project._id, "/overview"])],
      { relativeTo: this.route }
    );
  }

  async toProjectCollection() {
    await this.router.navigate(["/projects"], { relativeTo: this.route });
  }

  async openDemo(demo: Demo) {
    await this.router.navigate(["".concat(...["/demos/", demo._id])], {
      relativeTo: this.route,
    });
  }

  async toDemoCollection() {
    await this.router.navigate(["/demos"], { relativeTo: this.route });
  }

  async openUserStudy(study: UserStudy) {
    await this.router.navigate(["".concat(...["/user-studies/", study._id])], {
      relativeTo: this.route,
    });
  }

  async toUserStudyCollection() {
    await this.router.navigate(["/user-studies"], { relativeTo: this.route });
  }
}
