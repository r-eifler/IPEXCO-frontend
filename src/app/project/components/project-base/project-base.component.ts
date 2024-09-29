import { PlanningTaskRelaxationService } from "../../../service/planning-task/planning-task-relaxations-services";
import { QUESTION_REDIRECT } from "../../../app.tokens";
import { PlannerService } from "../../../service/planner-runs/planner.service";
import { DemosService } from "../../../service/demo/demo-services";
import { IterationStepsService } from "src/app/service/planner-runs/iteration-steps.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { CurrentProjectService, ProjectsService } from "src/app/service/project/project-services";
import { PlanPropertyMapService } from "src/app/service/plan-properties/plan-property-services";
import { PLANNER_REDIRECT } from "src/app/app.tokens";
import { Subject } from "rxjs";
import { NewIterationStepGenerationService } from "src/app/service/planner-runs/new-iteration-step-generation-service.service";
import { Project } from "../../domain/project";
import { Store } from "@ngrx/store";
import { loadProject } from "../../state/project.actions";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"

@Component({
  selector: "app-project-base",
  templateUrl: "./project-base.component.html",
  styleUrls: ["./project-base.component.css"],
  providers: [
    { provide: IterationStepsService, useClass: IterationStepsService },
    { provide: PlannerService, useClass: PlannerService },
    {
      provide: NewIterationStepGenerationService,
      useClass: NewIterationStepGenerationService,
    },
    { provide: PLANNER_REDIRECT, useValue: "../run-overview-mobile" },
    { provide: QUESTION_REDIRECT, useValue: "../../../run-overview-mobile" },
  ],
})
export class ProjectBaseComponent implements OnInit {

  activeLink = "";
  links = [
    { ref: "./overview", name: "Overview" },
    { ref: "./settings", name: "Settings" },
    { ref: "./planning-task", name: "Planning Task" },
    { ref: "./properties", name: "Plan Properties" },
    { ref: "./iterative-planning", name: "Iterative Planning" }
  ];

  project: Project;

  constructor(
    store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {

    this.route.paramMap
      .pipe(
        tap((params) => console.log(params.get("projectid"))),
        tap((params: ParamMap) => store.dispatch(loadProject({id: params.get("projectid")}))),
        takeUntilDestroyed()
      ).subscribe();
  }

  ngOnInit(): void {
    for (const l of this.links) {
      if (this.router.url.includes(l.ref.replace("./", ""))) {
        this.activeLink = l.ref;
        break;
      }
    }
  }

}
