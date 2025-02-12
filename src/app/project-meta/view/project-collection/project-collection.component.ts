import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ActionCardComponent } from "src/app/shared/components/action-card/action-card/action-card.component";
import { PageModule } from "src/app/shared/components/page/page.module";
import { AskDeleteComponent } from "../../../shared/components/ask-delete/ask-delete.component";
import { ProjectMetaData } from "../../domain/project-meta";
import { deleteProject, loadProjectMetaDataList } from "../../state/project-meta.actions";
import { selectProjectCreationError, selectProjectCreationNone, selectProjectCreationPending, selectProjectsMetaData } from "../../state/project-meta.selector";
import { ProjectCreatorComponent } from "../project-creator/project-creator.component";


@Component({
    selector: "app-project-selection",
    imports: [
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatButtonModule,
        RouterModule,
        PageModule,
        AsyncPipe,
        NgIf,
        NgFor,
        ActionCardComponent,
    ],
    templateUrl: "./project-collection.component.html",
    styleUrls: ["./project-collection.component.scss"]
})
export class ProjectCollectionComponent{

  projectsMetaData$: Observable<ProjectMetaData[]>;
  projectCreationPending$: Observable<boolean>
  projectCreationError$: Observable<boolean>
  projectCreationNone$: Observable<boolean>

  constructor(
    private store: Store,
    public dialog: MatDialog
  ) {

    store.dispatch(loadProjectMetaDataList())

    this.projectsMetaData$ = store.select(selectProjectsMetaData)
    this.projectCreationPending$ = store.select(selectProjectCreationPending)
    this.projectCreationError$ = store.select(selectProjectCreationError)
    this.projectCreationNone$ = store.select(selectProjectCreationNone)
  }


  new_project_form(): void {
    this.dialog.open(ProjectCreatorComponent);
  }



  openDeleteDialog(projectMetaData: ProjectMetaData): void {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Project", text: "Are you sure you want to delete project: " + projectMetaData.name + "?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.store.dispatch(deleteProject({id: projectMetaData._id}));
      }
    });
  }
}
