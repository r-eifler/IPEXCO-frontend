import { Component, OnInit } from "@angular/core";
import { Project } from "../../domain/project";

@Component({
  selector: "app-project-base",
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
