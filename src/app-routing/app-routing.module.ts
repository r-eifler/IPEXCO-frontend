import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TemplateFileUploadComponent } from "src/app/components/files/file-upload/file-upload.component";



const routes: Routes = [
  { path: "domain-file", component: TemplateFileUploadComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
