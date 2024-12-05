import { Component, OnInit } from "@angular/core";
import { Project } from "../../domain/project";
import { ProjectSettingsContainerComponent } from "../../components/project-settings-container/project-settings-container.component";
import { MatTabsModule } from "@angular/material/tabs";
import { PlanningTaskViewComponent } from "src/app/components/planning-task/planning-task-view/planning-task-view.component";
import { ProjectOverviewComponent } from "../../components/project-overview/project-overview.component";

@Component({
  selector: "app-project-base",
  standalone: true,
  imports:[
    ProjectSettingsContainerComponent,
    MatTabsModule,
    PlanningTaskViewComponent,
    ProjectOverviewComponent,
  ],
  templateUrl: "./project-base.component.html",
  styleUrls: ["./project-base.component.css"],
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

  constructor() {
  }

  ngOnInit(): void {

  }

}
