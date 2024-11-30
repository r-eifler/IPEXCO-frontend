import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Demo } from "src/app/interface/demo";
import { UserStudy } from "../../../interface/user-study/user-study";
import { Project } from "src/app/project/domain/project";
import { MatIcon } from "@angular/material/icon";
import { AsyncPipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-user-main-page",
  standalone: true,
  imports: [
    MatIcon,
    AsyncPipe,
    MatCardModule
  ],
  templateUrl: "./user-main-page.component.html",
  styleUrls: ["./user-main-page.component.scss"],
})
export class UserMainPageComponent implements OnInit {

  isMobile: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.responsiveService
    //   .getMobileStatus()
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((isMobile) => {
    //     this.isMobile = isMobile;
    //   });
    // this.responsiveService.checkWidth();

    // this.projectsService.findCollection();
    // // this.demosService.findCollection();
    // this.userStudiesService.findCollection();
  }


  async openProject(project: Project) {
    // console.log(''.concat(...['/projects/', project._id, '/overview']));
    await this.router.navigate(
      ["".concat(...["/projects/", project._id, "/overview"])],
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
