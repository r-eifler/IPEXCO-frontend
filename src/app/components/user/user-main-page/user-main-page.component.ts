import { Project } from "./../../../interface/project";
import {
  DomainFilesService,
  DomainSpecificationFilesService,
  ProblemFilesService,
} from "../../../service/files/pddl-file-services";
import { DemosService } from "../../../service/demo/demo-services";
import { ProjectsService } from "../../../service/project/project-services";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";
import { takeUntil } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Demo } from "src/app/interface/demo";
import { Subject } from "rxjs";
import { UserStudiesService } from "../../../service/user-study/user-study-services";
import { UserStudy } from "../../../interface/user-study/user-study";

@Component({
  selector: "app-user-main-page",
  templateUrl: "./user-main-page.component.html",
  styleUrls: ["./user-main-page.component.scss"],
})
export class UserMainPageComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    public projectsService: ProjectsService,
    public demosService: DemosService,
    public userStudiesService: UserStudiesService,
    public domainFilesService: DomainFilesService,
    public problemFilesService: ProblemFilesService,
    public domainSpecificationFilesService: DomainSpecificationFilesService,
    private router: Router,
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

    this.projectsService.findCollection();
    this.demosService.findCollection();
    this.userStudiesService.findCollection();
    this.domainFilesService.findFiles();
    this.problemFilesService.findFiles();
    this.domainSpecificationFilesService.findFiles();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
