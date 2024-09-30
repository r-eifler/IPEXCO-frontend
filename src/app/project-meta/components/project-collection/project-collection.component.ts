import { Component} from "@angular/core";
import { Observable } from "rxjs";
import { ProjectCreatorComponent } from "../project-creator/project-creator.component";
import { MatDialog } from "@angular/material/dialog";
import { AskDeleteComponent } from "../../../components/utils/ask-delete/ask-delete.component";
import { Store } from "@ngrx/store";
import { ProjectMetaData } from "../../domain/project-meta";
import { selectProjectCreationError, selectProjectCreationNone, selectProjectCreationPending, selectProjectsMetaData } from "../../state/project-meta.selector";
import { deleteProject, loadProjectMetaDataList } from "../../state/project-meta.actions";


@Component({
  selector: "app-project-selection",
  templateUrl: "./project-collection.component.html",
  styleUrls: ["./project-collection.component.scss"],
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
