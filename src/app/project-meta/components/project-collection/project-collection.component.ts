import { Component} from "@angular/core";
import { Observable } from "rxjs";
import { ProjectCreatorComponent } from "../project-creator/project-creator.component";
import { MatDialog } from "@angular/material/dialog";
import { AskDeleteComponent } from "../../../shared/components/ask-delete/ask-delete.component";
import { Store } from "@ngrx/store";
import { ProjectMetaData } from "../../domain/project-meta";
import { selectProjectCreationError, selectProjectCreationNone, selectProjectCreationPending, selectProjectsMetaData } from "../../state/project-meta.selector";
import { deleteProject, loadProjectMetaDataList } from "../../state/project-meta.actions";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { PageComponent } from "src/app/shared/components/page/page/page.component";
import { PageContentComponent } from "src/app/shared/components/page/page-content/page-content.component";
import { PageModule } from "src/app/shared/components/page/page.module";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ActionCardComponent } from "src/app/shared/components/action-card/action-card/action-card.component";


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
    this.dialog.open(ProjectCreatorComponent, {
      minWidth: "1000px",
      data: {project: null}
    });
  }



  openDeleteDialog(projectMetaData: ProjectMetaData): void {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: "Delete Project", text: "Are you sure you want to delete project: " + projectMetaData.name + "?"},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.store.dispatch(deleteProject({id: projectMetaData._id}));
      }
    });
  }
}
