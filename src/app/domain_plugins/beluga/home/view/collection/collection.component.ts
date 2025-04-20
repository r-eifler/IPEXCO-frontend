import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { ProjectMetaData } from "src/app/project-meta/domain/project-meta";
import { ActionCardComponent } from "src/app/shared/components/action-card/action-card/action-card.component";
import { AskDeleteComponent } from "src/app/shared/components/ask-delete/ask-delete.component";
import { PageModule } from "src/app/shared/components/page/page.module";
import { ProjectCardComponent } from "../../components/project-card/project-card.component";
import { selectProjects } from "../../state/home.selector";
import { provideTranslocoScope, TranslocoModule } from "@jsverse/transloco";
import { ProjectCreatorComponent } from "../creator/creator.component";
import { loadProjects } from "../../state/home.actions";


@Component({
    selector: "app-project-collection",
    imports: [
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatButtonModule,
        RouterModule,
        PageModule,
        AsyncPipe,
        ActionCardComponent,
        ProjectCardComponent,
        TranslocoModule
    ],
    providers: [
      provideTranslocoScope({
        scope: "home",
        alias: "h",
      }),
    ],
    templateUrl: "./collection.component.html",
    styleUrls: ["./collection.component.scss"]
})
export class CollectionComponent{

  store = inject(Store);
  dialog = inject(MatDialog)

  projects$ = this.store.select(selectProjects)

  constructor() {
    this.store.dispatch(loadProjects())
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
        // this.store.dispatch(deleteProject({id: projectMetaData._id}));
      }
    });
  }
}
