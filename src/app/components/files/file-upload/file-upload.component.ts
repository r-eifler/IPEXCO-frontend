import { takeUntil } from "rxjs/operators";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FilesService } from "../../../service/files/pddl-files.service";

import { PDDLFile } from "../../../interface/files/files";
import { Observable, Subject } from "rxjs";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";

@Component({
  selector: "app-template-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.css"],
})
export class TemplateFileUploadComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();
  isMobile: boolean;

  @Input() type;

  displayedColumns: string[] = ["file-icon", "name", "domain", "delete"];

  // form fields
  fileForm = new FormGroup({
    name: new FormControl(),
    domain: new FormControl(),
    type: new FormControl(),
    file: new FormControl(),
  });

  // uploaded file
  fileToUpload;
  fileObject;

  // files observable
  files$: Observable<PDDLFile[]>;
  selectedFiles: PDDLFile[];

  constructor(
    private responsiveService: ResponsiveService,
    private fileService: FilesService
  ) {}

  ngOnInit(): void {
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isMobile) => {
        if (isMobile) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      });
    this.responsiveService.checkWidth();

    this.files$ = this.fileService.files$;
    this.fileService
      .findFiles()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit() {
    const uploadFile: PDDLFile = {
      _id: null,
      path: "",
      name: this.fileForm.controls.name.value,
      type: this.type,
      domain: this.fileForm.controls.domain.value,
      content: this.fileObject,
    };

    this.fileService.saveFile(uploadFile);
  }

  onUploadFileSelected() {
    const inputNode: any = document.querySelector("#file" + this.type);
    this.fileObject = inputNode.files[0];

    if (typeof FileReader !== "undefined") {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.fileToUpload = e.target.result;
      };

      this.fileForm.controls.name.setValue(inputNode.files[0].name);
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  deleteFile(file: PDDLFile) {
    this.fileService.deleteFile(file);
  }
}
