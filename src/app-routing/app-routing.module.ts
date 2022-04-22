import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { TemplateFileUploadComponent } from "../app/components/files/template-file-upload/template-file-upload.component";

const routes: Routes = [
  { path: "domain-file", component: TemplateFileUploadComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
