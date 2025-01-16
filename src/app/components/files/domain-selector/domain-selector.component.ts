import { Component, OnInit } from "@angular/core";
import { DomainFilesService } from "../../../service/files/pddl-file-services";
import { FilesService } from "../../../service/files/pddl-files.service";
import { SelectedObjectService } from "../../../service/base/selected-object.service";
import { TemplateFileUploadComponent } from "../file-upload/file-upload.component";

@Component({
    selector: "app-domain-selector",
    imports: [
        TemplateFileUploadComponent,
    ],
    templateUrl: "./domain-selector.component.html",
    styleUrls: ["./domain-selector.component.css"],
    providers: [{ provide: FilesService, useClass: DomainFilesService }]
})
export class DomainSelectorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
